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

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { id, name, email, avatar, location } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    let user = await User.findOne({ email });
    if (!user) {
      // Create new user if they don't exist
      user = await User.create({
        name,
        email,
        password: id, // Using google sub ID as dummy password, though they should always login via Google
        avatar: avatar || '',
        orders: [],
        quotes: [],
        addresses: [],
        savedDesigns: [],
        loyaltyPoints: 150,
      });
    }

    if (location) {
      user.lastLocation = {
        city: location.city,
        country: location.country,
        lat: location.lat,
        lng: location.lng
      };
      await user.save();
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

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, location } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (location) {
      user.lastLocation = {
        city: location.city,
        country: location.country,
        lat: location.lat,
        lng: location.lng
      };
      await user.save();
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

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'If an account with that email exists, we have sent a password reset link.' });
    }
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    console.log(`\n\n=== PASSWORD RESET LINK ===\nhttp://localhost:3000/forgot-password?token=${resetToken}\n===========================\n\n`);
    res.json({ message: 'If an account with that email exists, we have sent a password reset link.', mockToken: resetToken });
  } catch (err) {
    if (isDbError(err)) return res.status(503).json({ message: 'Database unavailable', offline: true });
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Token and password are required' });
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    if (isDbError(err)) return res.status(503).json({ message: 'Database unavailable', offline: true });
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
