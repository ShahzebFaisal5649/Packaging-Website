const express = require('express');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

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
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });
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
    res.json({ message: 'Quote updated', quote });
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

    res.json({ statusCounts, monthRevenue, userGrowth });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
