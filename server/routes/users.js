const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
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
    if (phone !== undefined) user.phone = phone;
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
    const user = await User.findById(req.user._id).select('orders');
    res.json({ orders: user.orders });
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

    // Create order entry
    const order = {
      orderId: `ORD-${Date.now()}`,
      items: items,
      total: total,
      subtotal: items.reduce((sum, item) => sum + (item.price * item.qty), 0),
      tax: total - items.reduce((sum, item) => sum + (item.price * item.qty), 0),
      shippingAddress: shippingAddress,
      paymentIntentId: paymentIntentId,
      status: 'Processing',
      tracking: '',
      createdAt: new Date(),
    };

    user.orders.push(order);
    await user.save();
    res.json({ order, message: 'Order created successfully' });
  } catch (err) {
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

module.exports = router;
