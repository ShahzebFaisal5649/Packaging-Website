const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Quote = require('../models/Quote');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const quotes = await Quote.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ user, orders, quotes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, avatar, notifications } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (phone !== undefined) {
      // Validate phone: allow +, digits, spaces, dashes, parentheses, min 7 digits
      const digits = (phone || '').replace(/\D/g, '');
      if (phone && (digits.length < 7 || digits.length > 15)) {
        return res.status(400).json({ message: 'Invalid phone number. Must be 7–15 digits.' });
      }
      user.phone = phone;
    }
    if (avatar !== undefined) user.avatar = avatar;
    if (notifications) user.notifications = { ...user.notifications, ...notifications };
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/password
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters.' });
    }
    const user = await User.findById(req.user._id);
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// — Addresses —
router.post('/addresses', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.isDefault) {
      user.addresses.forEach(a => (a.isDefault = false));
    }
    user.addresses.push(req.body);
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/addresses/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.id);
    if (!addr) return res.status(404).json({ message: 'Address not found' });
    if (req.body.isDefault) user.addresses.forEach(a => (a.isDefault = false));
    Object.assign(addr, req.body);
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/addresses/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.pull({ _id: req.params.id });
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// — Saved Designs —
router.post('/designs', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedDesigns.push({ ...req.body, date: new Date() });
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/designs/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const design = user.savedDesigns.id(req.params.id);
    if (!design) return res.status(404).json({ message: 'Design not found' });
    Object.assign(design, req.body);
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/designs/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedDesigns.pull({ _id: req.params.id });
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// — Favourites —
router.post('/favourites/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const idx = user.favorites.indexOf(req.params.productId);
    if (idx > -1) {
      user.favorites.splice(idx, 1);
    } else {
      user.favorites.push(req.params.productId);
    }
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// — Orders —
router.get('/orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/orders', protect, async (req, res) => {
  try {
    const { items, total, shippingAddress, paymentIntentId } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ message: 'No items in order' });
    }
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const subtotal = items.reduce((sum, item) => sum + ((parseFloat(item.price) || 0) * (parseInt(item.quantity || item.qty) || 1)), 0);

    // Create order in separate collection
    const order = await Order.create({
      orderId: `ORD-${Date.now()}`,
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      items,
      total: parseFloat(total) || subtotal,
      subtotal,
      tax: (parseFloat(total) || subtotal) - subtotal,
      shippingAddress,
      paymentIntentId,
      status: 'Processing',
      tracking: '',
    });

    // ── Loyalty Points Logic ──────────────────────────────────────────────────
    const totalQty = items.reduce((s, it) => s + (parseInt(it.quantity || it.qty) || 1), 0);
    const orderCount = await Order.countDocuments({ userId: user._id });

    let pointsEarned = 25; // base points per order
    if (totalQty >= 100 && orderCount >= 10) pointsEarned = 100;
    else if (totalQty >= 50) pointsEarned = 75;
    else if (totalQty >= 25) pointsEarned = 50;

    const prevPoints = user.loyaltyPoints || 0;
    const newPoints = prevPoints + pointsEarned;
    user.loyaltyPoints = newPoints;

    // Tier thresholds
    const TIERS = [
      { name: 'Bronze', min: 0 },
      { name: 'Silver', min: 350, bonus: '10 free boxes' },
      { name: 'Gold',   min: 750, bonus: '20 free boxes' },
      { name: 'Platinum', min: 1500, bonus: '50 free boxes + free shipping' },
      { name: 'Diamond', min: 3000, bonus: '100 free boxes + priority support' },
    ];
    const getTier = pts => [...TIERS].reverse().find(t => pts >= t.min);
    const prevTier = getTier(prevPoints);
    const newTier = getTier(newPoints);
    await user.save();

    // Fire tier-up notification if tier changed
    let tierNotification = null;
    if (newTier.name !== prevTier.name) {
      tierNotification = { tier: newTier.name, bonus: newTier.bonus };
      try {
        const { sendNotification } = require('../utils/notifications');
        await sendNotification(user._id, {
          title: `🎉 You reached ${newTier.name} tier!`,
          message: `Congratulations! You've unlocked ${newTier.name} status. Bonus: ${newTier.bonus}.`,
          type: 'tier_upgrade',
        });
      } catch(e) { /* non-fatal */ }
    }

    res.json({ order, pointsEarned, newPoints: user.loyaltyPoints, tierNotification, message: 'Order created successfully' });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ message: err.message });
  }
});

// — Quotes / Sample Requests —
router.get('/quotes', protect, async (req, res) => {
  try {
    const quotes = await Quote.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ quotes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/quotes', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const quote = await Quote.create({
      quoteId: `QT-${Date.now()}`,
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      ...req.body,
    });

    res.json({ quote, message: 'Quote submitted successfully' });
  } catch (err) {
    console.error('Quote submission error:', err);
    res.status(500).json({ message: err.message });
  }
});

// — Admin: get all users —
router.get('/all', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/account — permanently delete account + all data
router.delete('/account', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    // Block deletion of super admin
    if (req.user.email === 'designcustombox@gmail.com') {
      return res.status(403).json({ message: 'Super admin account cannot be deleted.' });
    }
    await Promise.all([
      Order.deleteMany({ userId }),
      Quote.deleteMany({ userId }),
      User.findByIdAndDelete(userId),
    ]);
    res.json({ message: 'Account permanently deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
