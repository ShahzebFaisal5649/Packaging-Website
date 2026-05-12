if (!process.env.VERCEL) {
  require('dotenv').config();
  require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
}
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const User = require('./models/User');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const chatRoutes = require('./routes/chat');
const paymentRoutes = require('./routes/payment');
const contentRoutes = require('./routes/content');
const notificationRoutes = require('./routes/notifications');

const app = express();

app.use(compression({ level: 6, threshold: 1024 }));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://designcustombox.com',
    'https://www.designcustombox.com',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Log critical env vars at startup for easier debugging
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'RESEND_API_KEY'];
console.log(`[BOOT] Environment: ${process.env.VERCEL ? 'Vercel' : 'Local'}`);
requiredEnvVars.forEach(v => {
  if (!process.env[v]) {
    console.warn(`⚠️  Missing env var: ${v}`);
  } else {
    console.log(`✅ Found env var: ${v} (${process.env[v].substring(0, 5)}...)`);
  }
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

    // Run migration non-blocking in background
    setTimeout(async () => {
      try {
        const Order = require('./models/Order');
        const Quote = require('./models/Quote');
        
        const usersWithOrders = await User.find({ 'orders.0': { $exists: true } });
        let migratedOrders = 0;
        for (const u of usersWithOrders) {
          for (const o of u.orders) {
            const existing = await Order.findOne({ orderId: o.orderId });
            if (!existing) {
              await Order.create({
                ...o.toObject(),
                userId: u._id,
                userName: u.name,
                userEmail: u.email,
              }).catch(e => console.error('Failed to migrate order:', e.message));
              migratedOrders++;
            }
          }
        }
        if (migratedOrders > 0) console.log(`✅ Migrated ${migratedOrders} legacy orders to new collection`);

        const usersWithQuotes = await User.find({ 'quotes.0': { $exists: true } });
        let migratedQuotes = 0;
        for (const u of usersWithQuotes) {
          for (const q of u.quotes) {
            const existing = await Quote.findOne({ quoteId: q.quoteId });
            if (!existing) {
              await Quote.create({
                ...q.toObject(),
                userId: u._id,
                userName: u.name,
                userEmail: u.email,
              }).catch(e => console.error('Failed to migrate quote:', e.message));
              migratedQuotes++;
            }
          }
        }
        if (migratedQuotes > 0) console.log(`✅ Migrated ${migratedQuotes} legacy quotes to new collection`);
      } catch (migErr) {
        console.error('Migration error (non-fatal):', migErr);
      }
    }, 1000);

    
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
app.use('/api/notifications', requireDb, notificationRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    if (mongoose.connection.readyState !== 1) await connectDB();
    dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  } catch { /* */ }
  res.json({ status: 'ok', db: dbStatus, time: new Date().toISOString() });
});

// app.post('/api/contact', ...) is now handled by /api/content/contact in contentRoutes.js

// ── Sitemap.xml — dynamically generated from DB ──────────────────────────────
app.get('/sitemap.xml', requireDb, async (req, res) => {
  try {
    const BASE = 'https://designcustombox.com';
    const now = new Date().toISOString().split('T')[0];

    const Product = require('./models/Product');
    const Industry = require('./models/Industry');
    const [products, industries] = await Promise.all([
      Product.find({}, 'slug updatedAt').lean(),
      Industry.find({}, 'slug updatedAt').lean(),
    ]);

    const staticPages = [
      { loc: '/', priority: '1.0', changefreq: 'weekly' },
      { loc: '/products', priority: '0.9', changefreq: 'weekly' },
      { loc: '/industries', priority: '0.9', changefreq: 'weekly' },
      { loc: '/custom-box', priority: '0.8', changefreq: 'monthly' },
      { loc: '/about', priority: '0.7', changefreq: 'monthly' },
      { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
      { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
      { loc: '/how-it-works', priority: '0.7', changefreq: 'monthly' },
      { loc: '/inspiration', priority: '0.6', changefreq: 'monthly' },
    ];

    const urls = [
      ...staticPages.map(p => `
  <url>
    <loc>${BASE}${p.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),
      ...products.map(p => `
  <url>
    <loc>${BASE}/products/${p.slug}</loc>
    <lastmod>${p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`),
      ...industries.map(i => `
  <url>
    <loc>${BASE}/industries/${i.slug}</loc>
    <lastmod>${i.updatedAt ? new Date(i.updatedAt).toISOString().split('T')[0] : now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    res.status(500).send('<?xml version="1.0"?><error>Sitemap generation failed</error>');
  }
});

// Serve robots.txt
app.get('/robots.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('User-agent: *\nAllow: /\n\nSitemap: https://designcustombox.com/sitemap.xml\n');
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
