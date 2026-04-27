require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payment');
const contentRoutes = require('./routes/content');

// Disable Mongoose buffering globally (Mongoose 8 requires this before connect)
mongoose.set('bufferCommands', false);

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Allow no-origin requests (curl/mobile), any localhost port, CLIENT_URL, and Vercel domains
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin) ||
        origin === process.env.CLIENT_URL ||
        /\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── MongoDB connection (cached for serverless environments) ───────────────────
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✅ MongoDB connected');
    // Seed admin on first connect
    const adminExists = await User.findOne({ email: 'admin@novapack.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@novapack.com',
        password: 'Admin@123',
        role: 'admin',
        loyaltyPoints: 0,
      });
      console.log('✅ Admin seeded: admin@novapack.com / Admin@123');
    }
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
};

connectDB();

// Middleware: return 503 immediately if DB is not connected so the frontend falls back to localStorage
const requireDb = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database unavailable', offline: true });
  }
  next();
};

// Routes (requireDb ensures fast 503 when MongoDB is offline)
app.use('/api/auth', requireDb, authRoutes);
app.use('/api/users', requireDb, userRoutes);
app.use('/api/admin', requireDb, adminRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/payment', paymentRoutes); // Stripe — no DB dependency

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', time: new Date().toISOString() }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Only bind to a port when running locally (not in Vercel serverless)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 NovaPack server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
