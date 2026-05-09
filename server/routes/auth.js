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
    const user = await User.findById(req.user._id).select('-password').lean();
    if (user) {
      const Order = require('../models/Order');
      const Quote = require('../models/Quote');
      user.orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
      user.quotes = await Quote.find({ userId: user._id }).sort({ createdAt: -1 });
    }
    res.json({ user });
  } catch (err) {
    if (isDbError(err)) return res.status(503).json({ message: 'Database unavailable', offline: true });
    res.status(500).json({ message: err.message });
  }
});

const sendEmail = require('../utils/email');

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

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const message = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2ddd6; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #1A4D2E; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Design Custom <span style="color: #C8860A;">Box</span></h1>
        </div>
        <div style="padding: 40px; color: #1a1a1a;">
          <h2 style="font-size: 22px; font-weight: 800; margin: 0 0 16px 0;">Password Reset Request</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #6b6b6b; margin-bottom: 24px;">You requested a password reset for your Design Custom Box account. Click the button below to set a new password. This link is valid for <strong>1 hour</strong>.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #1A4D2E; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(26, 77, 46, 0.2);">Reset Your Password</a>
          </div>
          <p style="font-size: 14px; color: #9a9080; line-height: 1.6;">If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f0ede8; text-align: center; font-size: 12px; color: #9a9080;">
            <p style="margin: 0;">&copy; 2025 Design Custom Box. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request — Design Custom Box',
        html: message,
      });
      res.json({ message: 'Password reset link sent to your email.' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      console.error('Email send failed:', err);
      return res.status(500).json({ message: 'Email could not be sent' });
    }
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

    // Send confirmation email
    const successMessage = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2ddd6; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #1A4D2E; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Design Custom <span style="color: #C8860A;">Box</span></h1>
        </div>
        <div style="padding: 40px; color: #1a1a1a;">
          <div style="text-align: center; marginBottom: 30px;">
            <div style="width: 60px; height: 60px; background-color: #d1fae5; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span style="color: #059669; font-size: 30px;">✔</span>
            </div>
            <h2 style="font-size: 24px; font-weight: 800; margin: 0 0 10px 0;">Password Changed Successfully</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #6b6b6b; margin-bottom: 30px;">Your Design Custom Box account password has been updated. You can now log in using your new credentials.</p>
          </div>
          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/login" style="display: inline-block; padding: 14px 32px; background-color: #1A4D2E; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(26, 77, 46, 0.2);">Sign In to Your Account</a>
          </div>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f0ede8; text-align: center; font-size: 13px; color: #9a9080;">
            <p style="margin: 0;">If you did not authorize this change, please contact our support team immediately.</p>
            <p style="margin: 10px 0 0 0;">&copy; 2025 Design Custom Box. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Security Alert: Your password has been changed',
        html: successMessage,
      });
    } catch (err) {
      console.error('Success email failed:', err);
    }

    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    if (isDbError(err)) return res.status(503).json({ message: 'Database unavailable', offline: true });
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
