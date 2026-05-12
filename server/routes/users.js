const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Quote = require('../models/Quote');
const { protect } = require('../middleware/auth');
const sendEmail = require('../utils/email');
const Notification = require('../models/Notification');
const { sendNotification } = require('../utils/notifications');

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
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }
    const user = await User.findById(req.user._id);
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();

    // ── Security notification email ──────────────────────────────────────────
    sendEmail({
      email: user.email,
      subject: '🔐 Your DesignCustomBox Password Was Changed',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; max-width: 560px; margin: 0 auto;">
          <h2 style="color: #1A4D2E; margin-bottom: 8px;">Password Changed Successfully</h2>
          <p>Hi ${user.name},</p>
          <p>Your DesignCustomBox account password was just changed. If you made this change, no further action is needed.</p>
          <div style="background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 14px 18px; margin: 20px 0;">
            <p style="margin: 0; font-weight: 700; color: #92400E;">⚠️ If you did NOT make this change</p>
            <p style="margin: 6px 0 0; color: #92400E; font-size: 14px;">
              Please contact us immediately at
              <a href="mailto:designcustombox@gmail.com" style="color: #1A4D2E;">designcustombox@gmail.com</a>
              or call <strong>(913) 228-2682</strong>.
            </p>
          </div>
          <p style="color: #888; font-size: 13px;">Time of change: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CST</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #aaa;">Design Custom Box · 5532 Big River Dr, The Colony, TX 75056</p>
        </div>
      `,
    }).catch(err => console.warn('Password change email failed:', err.message));

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
    res.json(orders);
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
    const orderQty = items.reduce((sum, i) => sum + (parseInt(i.quantity || i.qty) || 1), 0);
    const totalUserOrders = await Order.countDocuments({ userId: req.user._id });

    let pointsEarned = 0;
    if (orderQty >= 500)                          pointsEarned = 200;
    else if (orderQty >= 100 && totalUserOrders >= 10) pointsEarned = 100;
    else if (orderQty >= 100)                     pointsEarned = 80;
    else if (orderQty >= 50)                      pointsEarned = 75;
    else                                           pointsEarned = 50; // qty < 50

    const oldPoints = user.loyaltyPoints || 0;
    user.loyaltyPoints = oldPoints + pointsEarned;
    await user.save();

    // Check and send tier upgrade notifications
    const TIERS = [
      { name: 'Silver',   threshold: 350,  bonus: '10 free boxes' },
      { name: 'Gold',     threshold: 750,  bonus: '20 free boxes' },
      { name: 'Platinum', threshold: 1500, bonus: '30 free boxes' },
      { name: 'Diamond',  threshold: 3000, bonus: '50 free boxes' },
    ];
    for (const tier of TIERS) {
      if (oldPoints < tier.threshold && user.loyaltyPoints >= tier.threshold) {
        await sendNotification(
          req.user._id,
          `You reached ${tier.name} tier!`,
          `Congratulations! You have unlocked ${tier.bonus} as a ${tier.name} member.`,
          'system',
          '/profile?tab=overview'
        );
        break; // Only notify for highest tier crossed
      }
    }

    // Send Confirmation Email
    const itemSummary = items.map(it => `<li>${it.name} (x${it.quantity || it.qty}) - $${it.price}</li>`).join('');
    await sendEmail({
      email: user.email,
      subject: "Your Custom Box Order Confirmed 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1A4D2E;">Order Confirmed!</h2>
          <p>Hi ${user.name},</p>
          <p>Thank you for your order! We are excited to start working on your custom packaging.</p>
          <div style="background: #F5F2ED; padding: 15px; borderRadius: 8px;">
            <h3 style="margin-top: 0;">Order ID: ${order.orderId}</h3>
            <ul>${itemSummary}</ul>
            <p><strong>Total: $${order.total}</strong></p>
          </div>
          <p>We will notify you once your order has been shipped.</p>
          <hr />
          <p style="font-size: 12px; color: #888;">Design Custom Box Team</p>
        </div>
      `
    });

    res.json({ order, pointsEarned, newPoints: user.loyaltyPoints, message: `Order placed! +${pointsEarned} loyalty points earned.` });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ message: err.message });
  }
});

// — Quotes / Sample Requests —
router.get('/quotes', protect, async (req, res) => {
  try {
    const quotes = await Quote.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(quotes);
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

    // Send Quote Confirmation Email
    await sendEmail({
      email: user.email,
      subject: "We've Received Your Quote Request 📄",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1A4D2E;">Quote Request Received</h2>
          <p>Hi ${user.name},</p>
          <p>We've received your request for a custom box quote (ID: ${quote.quoteId}). Our specialists are reviewing your specifications and will get back to you within 24 hours.</p>
          <div style="background: #F5F2ED; padding: 15px; borderRadius: 8px;">
            <p><strong>Box Type:</strong> ${req.body.boxType || 'N/A'}</p>
            <p><strong>Quantity:</strong> ${req.body.quantity || 'N/A'}</p>
          </div>
          <p>If you have any immediate questions, feel free to reply to this email.</p>
          <hr />
          <p style="font-size: 12px; color: #888;">Design Custom Box Team</p>
        </div>
      `
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
    const userDoc = await User.findById(userId);
    if (!userDoc) return res.status(404).json({ message: 'User not found' });

    await Promise.all([
      Order.deleteMany({ userId }),
      Quote.deleteMany({ userId }),
      Notification.deleteMany({ userId }),
      User.findByIdAndDelete(userId),
    ]);

    if (userDoc.googleToken) {
      // Attempt token revocation (fire and forget)
      fetch(`https://oauth2.googleapis.com/revoke?token=${userDoc.googleToken}`, { method: 'POST' })
        .catch(() => {});
    }
    res.json({ message: 'Account permanently deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/notifications — fetch all notifications for current user
router.get('/notifications', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Return newest first
    const sorted = [...(user.notifications || [])].reverse();
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/notifications/:id — remove one notification
router.delete('/notifications/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.notifications.pull({ _id: req.params.id });
    await user.save();
    res.json({ message: 'Notification removed', user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/notifications/all — clear all notifications
router.delete('/notifications/all', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.notifications = [];
    await user.save();
    res.json({ message: 'All notifications cleared', user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/notifications/read-all — mark all as read
router.put('/notifications/read-all', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.notifications.forEach(n => (n.isRead = true));
    await user.save();
    res.json({ message: 'All notifications marked as read', user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/notifications/:id/read — mark one as read
router.put('/notifications/:id/read', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const notif = user.notifications.id(req.params.id);
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    notif.isRead = true;
    await user.save();
    res.json({ message: 'Notification marked as read', user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
