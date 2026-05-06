const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Industry = require('../models/Industry');
const Subscriber = require('../models/Subscriber');
const ContactMessage = require('../models/ContactMessage');
const { protect, adminOnly } = require('../middleware/auth');
const sendEmail = require('../utils/email');

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// ── Stats ────────────────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('orders quotes loyaltyPoints createdAt');
    const totalUsers = users.length;
    const allOrders = users.flatMap(u => u.orders || []);
    const allQuotes = users.flatMap(u => u.quotes || []);
    const revenue = allOrders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0);
    const pending = allOrders.filter(o => o.status === 'Processing').length;
    const newThisWeek = users.filter(u => {
      const d = new Date(u.createdAt);
      return (Date.now() - d) < 7 * 24 * 60 * 60 * 1000;
    }).length;
    res.json({ totalUsers, totalOrders: allOrders.length, totalQuotes: allQuotes.length, revenue, pending, newThisWeek });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Users ────────────────────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { role, status, loyaltyPoints, name } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (role) user.role = role;
    if (status !== undefined) user.status = status;
    if (loyaltyPoints !== undefined) user.loyaltyPoints = loyaltyPoints;
    if (name) user.name = name;
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Content Management ────────────────────────────────────────────────────────
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json({ product });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
      return res.status(400).json({ message: 'A product with this slug already exists. Please choose a different name or modify the slug.' });
    }
    res.status(500).json({ message: err.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    Object.assign(product, req.body);
    await product.save();
    res.json({ product });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
      return res.status(400).json({ message: 'A product with this slug already exists. Please choose a different name or modify the slug.' });
    }
    res.status(500).json({ message: err.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/industries', async (req, res) => {
  try {
    const industries = await Industry.find().sort({ createdAt: -1 });
    res.json({ industries });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/industries', async (req, res) => {
  try {
    const industry = await Industry.create(req.body);
    res.json({ industry });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
      return res.status(400).json({ message: 'An industry with this slug already exists. Please choose a different name or modify the slug.' });
    }
    res.status(500).json({ message: err.message });
  }
});

router.put('/industries/:id', async (req, res) => {
  try {
    const industry = await Industry.findById(req.params.id);
    if (!industry) return res.status(404).json({ message: 'Industry not found' });
    Object.assign(industry, req.body);
    await industry.save();
    res.json({ industry });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
      return res.status(400).json({ message: 'An industry with this slug already exists. Please choose a different name or modify the slug.' });
    }
    res.status(500).json({ message: err.message });
  }
});

router.delete('/industries/:id', async (req, res) => {
  try {
    await Industry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Industry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Orders ───────────────────────────────────────────────────────────────────
router.get('/orders', async (req, res) => {
  try {
    const users = await User.find().select('name email orders');
    const orders = users.flatMap(u =>
      (u.orders || []).map(o => ({ ...o.toObject(), userId: u._id, userName: u.name, userEmail: u.email }))
    );
    orders.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/orders/:userId/:orderId', async (req, res) => {
  try {
    const { status, tracking } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const order = user.orders.id(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (status) order.status = status;
    if (tracking !== undefined) order.tracking = tracking;
    await user.save();
    res.json({ message: 'Order updated', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Quotes ───────────────────────────────────────────────────────────────────
router.get('/quotes', async (req, res) => {
  try {
    const users = await User.find().select('name email quotes');
    const quotes = users.flatMap(u =>
      (u.quotes || []).map(q => ({ ...q.toObject(), userId: u._id, userName: u.name, userEmail: u.email }))
    );
    quotes.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    res.json({ quotes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/quotes/:userId/:quoteId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const quote = user.quotes.id(req.params.quoteId);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    Object.assign(quote, req.body);
    await user.save();

    // Send email notification for quote update
    if (req.body.status || req.body.quotedPrice) {
      try {
        const htmlMessage = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #1A4D2E;">Quote Request Update</h2>
            <p>Hello ${user.name},</p>
            <p>Your quote request (<strong>${quote.quoteId}</strong>) has been updated.</p>
            <ul>
              <li><strong>Status:</strong> ${quote.status}</li>
              <li><strong>Price:</strong> ${quote.quotedPrice || 'Pending'}</li>
            </ul>
            <p>Log in to your account for more details.</p>
          </div>
        `;
        await sendEmail({
          email: user.email,
          subject: `Update on your Quote Request: ${quote.quoteId}`,
          html: htmlMessage,
        });
      } catch (err) {
        console.error('Failed to send quote update email:', err);
      }
    }

    res.json({ message: 'Quote updated', quote });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Contact Messages ─────────────────────────────────────────────────────────────
router.get('/contact-messages', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/contact-messages/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (status) message.status = status;
    await message.save();
    res.json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/messages/:id/reply', async (req, res) => {
  try {
    const { replyMessage } = req.body;
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    
    // Send email
    const htmlMessage = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #1A4D2E;">Re: ${message.subject}</h2>
        <p>Hi ${message.name},</p>
        <div style="padding: 15px; background: #f9f9f9; border-left: 4px solid #C8860A; margin: 20px 0;">
          <p style="white-space: pre-wrap; margin: 0;">${replyMessage}</p>
        </div>
        <p>Best regards,<br/>The Design Custom Box Team</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #888; font-size: 12px;">You wrote:</p>
        <blockquote style="color: #888; font-size: 12px; border-left: 2px solid #ddd; margin: 0; padding-left: 10px; white-space: pre-wrap;">${message.message}</blockquote>
      </div>
    `;
    
    await sendEmail({
      email: message.email,
      subject: `Re: ${message.subject}`,
      html: htmlMessage,
    });

    message.status = 'Replied';
    await message.save();
    
    res.json({ message: 'Reply sent', contactMessage: message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/contact-messages/:id', async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Subscribers ─────────────────────────────────────────────────────────────────
router.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json({ subscribers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/subscribers/:id', async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subscriber removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Revenue Analytics ────────────────────────────────────────────────────────
router.get('/analytics', async (req, res) => {
  try {
    const users = await User.find().select('orders createdAt');
    const allOrders = users.flatMap(u => u.orders || []);

    // Orders by status
    const statusCounts = ['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => ({
      label: s, value: allOrders.filter(o => o.status === s).length,
    }));

    // Revenue by month (last 6 months)
    const monthRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const val = allOrders
        .filter(o => o.date && o.date.startsWith(monthKey))
        .reduce((s, o) => s + (parseFloat(o.total) || 0), 0);
      monthRevenue.push({ label: d.toLocaleString('en', { month: 'short' }), value: Math.round(val) });
    }

    // New users per month (last 6 months)
    const userGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const month = d.getMonth();
      const year = d.getFullYear();
      const count = users.filter(u => {
        const cd = new Date(u.createdAt);
        return cd.getMonth() === month && cd.getFullYear() === year;
      }).length;
      userGrowth.push({ label: d.toLocaleString('en', { month: 'short' }), value: count });
    }

    // Extract locations from users (saved addresses) and orders
    const locations = [];
    users.forEach(u => {
      if (u.addresses && u.addresses.length > 0) {
        u.addresses.forEach(addr => {
          if (addr.city) locations.push({ city: addr.city, country: addr.country || 'US', type: 'User' });
        });
      }
      if (u.lastLocation && u.lastLocation.city) {
        locations.push({ ...u.lastLocation, type: 'Login' });
      }
    });
    allOrders.forEach(o => {
      if (o.shippingAddress && o.shippingAddress.city) {
        locations.push({ city: o.shippingAddress.city, country: 'US', type: 'Order' });
      } else if (o.address && o.address.includes(',')) {
        const parts = o.address.split(',');
        const city = parts[parts.length - 2]?.trim();
        if (city) locations.push({ city, country: 'US', type: 'Order' });
      }
    });

    res.json({ statusCounts, monthRevenue, userGrowth, locations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
