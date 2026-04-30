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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// ── MongoDB connection (cached for serverless — reuse across warm invocations) ─
let connectionPromise = null;

const connectDB = () => {
  if (connectionPromise) return connectionPromise;
  connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
  }).then(async () => {
    console.log('✅ MongoDB connected');
    const adminExists = await User.findOne({ email: 'admin@designcustombox.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin', email: 'admin@designcustombox.com', password: 'Admin@123',
        role: 'admin', loyaltyPoints: 0,
      });
      console.log('✅ Admin seeded');
    }
  }).catch(err => {
    connectionPromise = null; // allow retry on next request
    console.error('❌ MongoDB error:', err.message);
    throw err;
  });
  return connectionPromise;
};

// Middleware: ensure DB is ready before hitting any DB route
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
app.use('/api/content', requireDb, contentRoutes);
app.use('/api/payment', paymentRoutes); // Stripe — no DB dependency

// Health check
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    if (mongoose.connection.readyState !== 1) await connectDB();
    dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  } catch { /* */ }
  res.json({ status: 'ok', db: dbStatus, time: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use((err, req, res, _next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Payload too large. Please use a smaller image (max 50MB).' });
  }
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Only bind to a port when running locally (not in Vercel serverless)
if (!process.env.VERCEL) {
  connectDB(); // eagerly connect for local dev
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Design Custom Box server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
