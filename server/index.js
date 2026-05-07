require('dotenv').config();
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const chatRoutes = require('./routes/chat');
const paymentRoutes = require('./routes/payment');
const contentRoutes = require('./routes/content');

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin) ||
        origin === process.env.CLIENT_URL ||
        origin.includes('.vercel.app') ||
        origin.includes('designcustombox.com')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Log critical env vars at startup for easier debugging
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
requiredEnvVars.forEach(v => {
  if (!process.env[v]) console.warn(`⚠️  Missing env var: ${v}`);
});

// ── MongoDB connection (cached for serverless) ─────────────────────────────
let connectionPromise = null;

const connectDB = () => {
  if (connectionPromise) return connectionPromise;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is missing from .env');
    return Promise.reject(new Error('MONGODB_URI not set'));
  }
  console.log('⏳ Connecting to MongoDB...');
  connectionPromise = mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  }).then(async () => {
    console.log('✅ MongoDB connected');

    // Seed super admin account
    let admin = await User.findOne({ email: 'designcustombox@gmail.com' });
    if (!admin) {
      await User.create({
        name: 'Design Custom Box',
        email: 'designcustombox@gmail.com',
        password: 'Admin@123',
        role: 'super_admin',
        loyaltyPoints: 0,
      });
      console.log('✅ Super Admin seeded');
    } else if (admin.role !== 'super_admin') {
      // Migrate existing admin to super_admin
      admin.role = 'super_admin';
      await admin.save();
      console.log('✅ Admin upgraded to super_admin');
    }
  }).catch(err => {
    connectionPromise = null;
    console.error('❌ MongoDB error:', err.message);
    throw err;
  });
  return connectionPromise;
};

const requireDb = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    next();
  } catch {
    res.status(503).json({ message: 'Database unavailable', offline: true });
  }
};

// Routes
app.use('/api/auth', requireDb, authRoutes);
app.use('/api/users', requireDb, userRoutes);
app.use('/api/admin', requireDb, adminRoutes);
app.use('/api/chat', requireDb, chatRoutes);
app.use('/api/content', requireDb, contentRoutes);
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    if (mongoose.connection.readyState !== 1) await connectDB();
    dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  } catch { /* */ }
  res.json({ status: 'ok', db: dbStatus, time: new Date().toISOString() });
});

// Register contact route directly for compatibility
const ContactMessage = require('./models/ContactMessage');
app.post('/api/contact', requireDb, async (req, res) => {
  try {
    const { name, email, phone, companyName, subject, projectDetails, message } = req.body;
    const finalMessage = projectDetails || message;

    if (!name || !email || !subject || !finalMessage) {
      return res.status(400).json({ message: 'Name, email, subject, and message are required.' });
    }

    const contact = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      company: companyName || req.body.company || '',
      subject,
      message: finalMessage,
      interests: req.body.interests || [],
    });

    res.status(201).json({ success: true, message: 'Message sent successfully', contact });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ message: 'Could not submit: ' + err.message });
  }
});

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Payload too large. Max 50MB.' });
  }
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

if (!process.env.VERCEL) {
  connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Design Custom Box server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
