const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const isDbError = (err) =>
  err.message && (
    err.message.includes('buffering') ||
    err.message.includes('not connected') ||
    err.message.includes('ECONNREFUSED') ||
    err.message.includes('topology') ||
    err.name === 'MongoNetworkError' ||
    err.name === 'MongooseServerSelectionError'
  );

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      orders: [
        {
          orderId: `NP-${Date.now()}`,
          product: 'Welcome Sample Pack',
          qty: 1,
          total: 0,
          status: 'Delivered',
          address: 'Sample Address',
        },
      ],
      quotes: [],
      addresses: [],
      savedDesigns: [],
      loyaltyPoints: 150,
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: user.toSafeObject(),
    });
  } catch (err) {
    if (isDbError(err)) return res.status(503).json({ message: 'Database unavailable', offline: true });
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({
      token: generateToken(user._id),
      user: user.toSafeObject(),
    });
  } catch (err) {
    if (isDbError(err)) return res.status(503).json({ message: 'Database unavailable', offline: true });
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (err) {
    if (isDbError(err)) return res.status(503).json({ message: 'Database unavailable', offline: true });
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
