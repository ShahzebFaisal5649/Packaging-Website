const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Industry = require('../models/Industry');
const Subscriber = require('../models/Subscriber');
const ContactMessage = require('../models/ContactMessage');
const Order = require('../models/Order');
const Quote = require('../models/Quote');
const { sendNotification } = require('../utils/notifications');
const { protect, adminOnly, superAdminOnly, SUPER_ADMIN_EMAIL } = require('../middleware/auth');
const sendEmail = require('../utils/email');

const router = express.Router();

let _statsCache = null;
let _statsCacheAt = 0;

// All admin routes require auth + admin/super_admin role
router.use(protect, adminOnly);

// ── Stats ────────────────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  // Return cache if fresh (30 seconds)
  if (_statsCache && Date.now() - _statsCacheAt < 30000) {
    return res.json(_statsCache);
  }
  try {
    const users = await User.find({ role: { $in: ['user'] } }).select('orders quotes loyaltyPoints createdAt');
    const allOrders = await Order.find();
    const allQuotes = await Quote.find();
    const revenue = allOrders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0);
    const pending = allOrders.filter(o => o.status === 'Processing').length;
    const newThisWeek = users.filter(u => (Date.now() - new Date(u.createdAt)) < 7 * 24 * 60 * 60 * 1000).length;
    const result = {
      totalUsers: users.length,
      totalOrders: allOrders.length,
      totalQuotes: allQuotes.length,
      revenue,
      pending,
      newThisWeek
    };
    _statsCache = result;
    _statsCacheAt = Date.now();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Users ────────────────────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    // Single aggregation to count orders per user — avoids N+1 query
    const [users, orderCounts] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).lean(),
      Order.aggregate([
        { $group: { _id: '$userId', count: { $sum: 1 } } }
      ])
    ]);
    const countMap = {};
    orderCounts.forEach(r => { countMap[String(r._id)] = r.count; });
    const usersWithCounts = users.map(u => ({
      ...u,
      orderCount: countMap[String(u._id)] || 0
    }));
    res.json({ users: usersWithCounts });
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
    const { status, loyaltyPoints, name } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Protect super admin from ANY modifications
    if (user.role === 'super_admin') {
      return res.status(403).json({ message: 'Unauthorized: The Super Admin account cannot be modified.' });
    }

    if (status !== undefined) user.status = status;
    if (loyaltyPoints !== undefined) user.loyaltyPoints = loyaltyPoints;
    if (name) user.name = name;
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Role change — super admin only
router.put('/users/:id/role', superAdminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (role === 'super_admin') {
      return res.status(403).json({ message: 'The Super Admin role cannot be assigned.' });
    }
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be "user" or "admin".' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Never allow changing the super admin's role
    if (user.role === 'super_admin') {
      return res.status(403).json({ message: 'Unauthorized: The Super Admin role cannot be changed.' });
    }

    user.role = role;
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/users/:id', superAdminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'super_admin') {
      return res.status(403).json({ message: 'Unauthorized: The Super Admin account cannot be deleted.' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Products ─────────────────────────────────────────────────────────────────
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
    if (err.code === 11000 && err.keyPattern?.slug) {
      return res.status(400).json({ message: 'A product with this slug already exists.' });
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
    if (err.code === 11000 && err.keyPattern?.slug) {
      return res.status(400).json({ message: 'A product with this slug already exists.' });
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

// ── Industries ────────────────────────────────────────────────────────────────
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
    if (err.code === 11000 && err.keyPattern?.slug) {
      return res.status(400).json({ message: 'An industry with this slug already exists.' });
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
    if (err.code === 11000 && err.keyPattern?.slug) {
      return res.status(400).json({ message: 'An industry with this slug already exists.' });
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
    const orders = await Order.find().sort({ createdAt: -1 });
    const formattedOrders = orders.map(o => ({
      ...o.toObject(),
      id: o.orderId,
      qty: o.items?.reduce((sum, i) => sum + (i.quantity || 1), 0) || 0,
      fullAddress: o.shippingAddress ? `${o.shippingAddress.line1 || ''}, ${o.shippingAddress.city || ''}` : null
    }));
    res.json({ orders: formattedOrders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/orders/:userId/:orderId', async (req, res) => {
  try {
    const { status, tracking } = req.body;
    
    // Check if :orderId is a Mongo _id or an orderId string like ORD-...
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.orderId);
    const order = isObjectId 
      ? await Order.findById(req.params.orderId)
      : await Order.findOne({ orderId: req.params.orderId });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // ── Enforce Sequential Logic ──
    const current = order.status;
    const allowed = {
      'Processing': ['Shipped', 'Cancelled'],
      'Shipped': ['Delivered'],
      'Delivered': [],
      'Cancelled': []
    };

    if (status && status !== current) {
      if (!allowed[current].includes(status)) {
        return res.status(400).json({ 
          message: `Invalid transition: Cannot move from ${current} to ${status}.` 
        });
      }
    }

    // If trying to mark as Shipped, require a tracking number
    if (status === 'Shipped') {
      const trackingNumber = tracking || order.tracking;
      if (!trackingNumber || !trackingNumber.trim()) {
        return res.status(400).json({
          message: 'Please provide a tracking number before marking as Shipped.'
        });
      }
    }

    if (tracking !== undefined) order.tracking = tracking;
    if (status && order.status !== status) {
      const oldStatus = order.status;
      order.status = status;
      if (!order.statusDates) order.statusDates = {};
      const statusKey = status.toLowerCase();
      order.statusDates[statusKey] = new Date();
      // Also update top level processingDate for backward compatibility if needed
      if (status === 'Processing') order.processingDate = new Date();

      // Auto-calculate loyalty points when marked as Delivered
      if (status === 'Delivered' && oldStatus !== 'Delivered') {
        try {
          const [user, settings] = await Promise.all([
            User.findById(order.userId),
            GlobalSettings.findOne()
          ]);

          if (user && settings) {
            const basePointsPerDollar = settings.loyaltySettings?.pointsPerDollar || 1;
            const multipliers = settings.loyaltySettings?.multipliers || [];
            
            // Find multiplier for user role (default to 1)
            const roleMultiplier = multipliers.find(m => m.role === user.role)?.multiplier || 1;
            
            const pointsToAdd = Math.floor((order.total || 0) * basePointsPerDollar * roleMultiplier);
            
            if (pointsToAdd > 0) {
              user.loyaltyPoints = (user.loyaltyPoints || 0) + pointsToAdd;
              await user.save();
              console.log(`✅ Added ${pointsToAdd} loyalty points to user ${user.email} (Role: ${user.role}, Multiplier: ${roleMultiplier})`);
              
              // Notify user about points
              await sendNotification(
                user._id,
                'Loyalty Points Earned!',
                `Congratulations! You've earned ${pointsToAdd} points from your order ${order.orderId}.`,
                'loyalty_update',
                '/profile?tab=loyalty'
              );
            }
          }
        } catch (loyaltyErr) {
          console.error('❌ Failed to calculate/add loyalty points:', loyaltyErr.message);
        }
      }
    }

    // Send status change email
    if (status && status !== current) {
      try {
        const statusHtml = `
          <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2ddd6;border-radius:16px;overflow:hidden;background:#ffffff;">
            <div style="background-color:#1A4D2E;padding:30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:800;letter-spacing:-0.5px;">
                Design Custom <span style="color:#C8860A;">Box</span>
              </h1>
            </div>
            <div style="padding:40px;color:#1a1a1a;">
              <div style="text-align:center;margin-bottom:32px;">
                <div style="width:64px;height:64px;background:#f8f5f0;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;border:1px solid #e2ddd6;">
                  <span style="font-size:28px;">${status === 'Delivered' ? '✅' : status === 'Shipped' ? '📦' : status === 'Cancelled' ? '❌' : '⚙️'}</span>
                </div>
                <h2 style="font-size:24px;font-weight:800;margin:0 0 8px 0;">Order Status Updated</h2>
                <p style="color:#6b6b6b;font-size:16px;margin:0;">Your order <strong>${order.orderId}</strong> is now <strong>${status}</strong>.</p>
              </div>
              <div style="background:#f8f5f0;border-radius:12px;padding:24px;margin-bottom:28px;">
                <h3 style="font-size:14px;font-weight:700;color:#1A4D2E;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 16px 0;">Order Details</h3>
                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                  <tr><td style="padding:6px 0;color:#6b6b6b;">Order ID</td><td style="padding:6px 0;font-weight:600;text-align:right;">${order.orderId}</td></tr>
                  <tr><td style="padding:6px 0;color:#6b6b6b;">New Status</td><td style="padding:6px 0;font-weight:700;color:${status === 'Cancelled' ? '#EF4444' : '#C8860A'};text-align:right;">${status}</td></tr>
                  ${order.tracking ? `<tr><td style="padding:6px 0;color:#6b6b6b;">Tracking Number</td><td style="padding:6px 0;font-weight:600;text-align:right;">${order.tracking}</td></tr>` : ''}
                </table>
              </div>
              <p style="font-size:15px;color:#6b6b6b;line-height:1.6;margin-bottom:28px;text-align:center;">
                ${status === 'Shipped' ? 'Your package is on its way! You can track it using the number provided.' : 
                  status === 'Delivered' ? 'Your package has been delivered. We hope you love your custom boxes!' :
                  status === 'Cancelled' ? 'Your order has been cancelled. If this was a mistake, please contact support.' :
                  'We are currently processing your order.'}
              </p>
              <div style="text-align:center;">
                <a href="${process.env.FRONTEND_URL || 'https://designcustombox.com'}/profile?tab=orders" style="display:inline-block;padding:14px 28px;background:#1A4D2E;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:700;font-size:14px;">View Order History</a>
              </div>
            </div>
            <div style="background:#f8f5f0;padding:20px;text-align:center;font-size:12px;color:#9a9080;border-top:1px solid #e2ddd6;">
              <p style="margin:0;">Questions? <a href="mailto:Designcustombox@gmail.com" style="color:#1A4D2E;text-decoration:none;font-weight:600;">Contact Support</a></p>
            </div>
          </div>
        `;
        const userEmail = order.userEmail || (await User.findById(order.userId))?.email;
        if (userEmail) {
          await sendEmail({
            email: userEmail,
            subject: `Order Update: ${order.orderId} is now ${status}`,
            html: statusHtml,
          });
          console.log(`✅ Status email sent to ${userEmail} for status ${status}`);
        }
      } catch (emailErr) {
        console.error('❌ Status email failed:', emailErr.message);
      }
    }

    await order.save();
    
    // Trigger notification if status changed
    if (status) {
      await sendNotification(
        order.userId,
        `Order ${order.orderId} Update`,
        `Your order status has been updated to ${status}.`,
        'order_status',
        '/profile?tab=orders'
      );
    }

    res.json({ message: 'Order updated', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Quotes ───────────────────────────────────────────────────────────────────
router.get('/quotes', async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    const formattedQuotes = quotes.map(q => ({
      ...q.toObject(),
      id: q.quoteId
    }));
    res.json({ quotes: formattedQuotes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/quotes/:quoteId', async (req, res) => {
  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.quoteId);
    const quote = isObjectId 
      ? await Quote.findById(req.params.quoteId)
      : await Quote.findOne({ quoteId: req.params.quoteId });

    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    Object.assign(quote, req.body);
    await quote.save();
    
    // Sync standalone quote to embedded User doc
    if (quote.userId) {
      const quoteQuery = isObjectId ? { 'quotes._id': req.params.quoteId } : { 'quotes.quoteId': req.params.quoteId };
      await User.findOneAndUpdate(
        { _id: quote.userId, ...quoteQuery },
        { $set: {
          'quotes.$.status': quote.status,
          'quotes.$.quotedPrice': quote.quotedPrice
        }}
      );

      // Trigger Notification
      if (req.body.status || req.body.quotedPrice) {
        await sendNotification(
          quote.userId,
          `Quote ${quote.quoteId} Update`,
          `Your quote status has been updated to ${quote.status}.`,
          'quote_update',
          '/profile?tab=quotes'
        );
      }
    }
    
    res.json({ message: 'Quote updated', quote });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/quotes/:userId/:quoteId', async (req, res) => {
  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.quoteId);
    const quote = isObjectId 
      ? await Quote.findById(req.params.quoteId)
      : await Quote.findOne({ quoteId: req.params.quoteId });

    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    Object.assign(quote, req.body);
    await quote.save();
    
    // Sync standalone quote to embedded User doc
    const quoteQuery = isObjectId ? { 'quotes._id': req.params.quoteId } : { 'quotes.quoteId': req.params.quoteId };
    await User.findOneAndUpdate(
      { _id: req.params.userId, ...quoteQuery },
      { $set: {
        'quotes.$.status': quote.status,
        'quotes.$.adminReply': quote.adminReply,
        'quotes.$.quotedPrice': quote.quotedPrice
      }}
    );
    
    const userEmail = quote.userEmail || (await User.findById(quote.userId))?.email;
    const userName = quote.userName || 'Customer';

    if (req.body.status || req.body.quotedPrice) {
      // Trigger Notification
      await sendNotification(
        quote.userId,
        `Quote ${quote.quoteId} Update`,
        `Your quote status has been updated to ${quote.status}.`,
        'quote_update',
        '/profile?tab=quotes'
      );
      try {
        if (userEmail) {
          await sendEmail({
            email: userEmail,
            subject: `Update on your Quote Request: ${quote.quoteId}`,
            html: `
              <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #eee;border-radius:10px;">
                <h2 style="color:#1A4D2E;">Quote Request Update</h2>
                <p>Hello ${userName},</p>
                <p>Your quote request (<strong>${quote.quoteId}</strong>) has been updated.</p>
              <ul>
                <li><strong>Status:</strong> ${quote.status}</li>
                <li><strong>Price:</strong> ${quote.quotedPrice || 'Pending'}</li>
              </ul>
              <p>Log in to your account for more details.</p>
            </div>
          `,
        });
        }
      } catch (err) {
        console.error('Failed to send quote update email:', err);
      }
    }

    res.json({ message: 'Quote updated', quote });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Contact Messages ──────────────────────────────────────────────────────────
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
    if (!replyMessage?.trim()) {
      return res.status(400).json({ message: 'Reply cannot be empty.' });
    }
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    // Send email — wrapped separately so failure doesn't block the response
    let emailSent = false;
    try {
      await sendEmail({
        email: message.email,
        subject: `Reply to your message – Design Custom Box`,
        html: `
          <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2ddd6;border-radius:16px;overflow:hidden;background:#ffffff;">
            <div style="background-color:#1A4D2E;padding:30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:800;">Design Custom <span style="color:#C8860A;">Box</span></h1>
            </div>
            <div style="padding:40px;color:#1a1a1a;">
              <h2 style="font-size:20px;font-weight:700;margin:0 0 8px 0;">Re: ${message.subject}</h2>
              <p style="color:#6b6b6b;margin:0 0 24px 0;">Hi ${message.name},</p>
              <div style="padding:20px;background:#f8f5f0;border-left:4px solid #C8860A;border-radius:0 8px 8px 0;margin-bottom:24px;">
                <p style="white-space:pre-wrap;margin:0;font-size:15px;line-height:1.7;">${replyMessage}</p>
              </div>
              <p style="color:#6b6b6b;font-size:14px;">Best regards,<br/><strong style="color:#1A4D2E;">The Design Custom Box Team</strong></p>
              <hr style="border:none;border-top:1px solid #f0ede8;margin:28px 0;" />
              <p style="color:#9a9080;font-size:12px;">Your original message:</p>
              <blockquote style="color:#9a9080;font-size:13px;border-left:4px solid #ddd;margin:0;padding-left:12px;white-space:pre-wrap;">${message.message}</blockquote>
            </div>
          </div>
        `,
      });
      emailSent = true;
    } catch (emailErr) {
      console.error('Reply email error:', emailErr.message);
      // Continue — still mark as replied and send notification
    }

    // Send in-app notification if user has an account with this email
    try {
      const user = await User.findOne({ email: message.email });
      if (user) {
        await sendNotification(
          user._id,
          'Reply to your message',
          `We have replied to your message: "${message.subject}"`,
          'message_reply',
          '/profile?tab=notifications'
        );
      }
    } catch (notifErr) {
      console.error('Notification error:', notifErr.message);
    }

    message.status = 'Replied';
    await message.save();
    res.json({
      message: emailSent ? 'Reply sent successfully' : 'Reply saved (email delivery pending)',
      contactMessage: message
    });
  } catch (err) {
    console.error('Reply route error:', err);
    res.status(500).json({ message: 'Failed to send reply.' });
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

// ── Subscribers ───────────────────────────────────────────────────────────────
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

// ── Analytics ─────────────────────────────────────────────────────────────────
router.get('/analytics', async (req, res) => {
  try {
    const users = await User.find().select('createdAt addresses lastLocation role');
    const regularUsers = users.filter(u => u.role === 'user');
    const allOrders = await Order.find();

    const statusCounts = ['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => ({
      label: s, value: allOrders.filter(o => o.status === s).length,
    }));

    const monthRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const month = d.getMonth();
      const year = d.getFullYear();
      const val = allOrders
        .filter(o => { const od = new Date(o.createdAt || Date.now()); return od.getMonth() === month && od.getFullYear() === year; })
        .reduce((s, o) => s + (parseFloat(o.total) || 0), 0);
      monthRevenue.push({ label: d.toLocaleString('en', { month: 'short' }), value: Math.round(val) });
    }

    const userGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const month = d.getMonth();
      const year = d.getFullYear();
      const count = regularUsers.filter(u => {
        const cd = new Date(u.createdAt);
        return cd.getMonth() === month && cd.getFullYear() === year;
      }).length;
      userGrowth.push({ label: d.toLocaleString('en', { month: 'short' }), value: count });
    }

    const locations = [];
    const toTitleCase = (str) =>
      str.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    
    users.forEach(u => {
      if (u.addresses?.length) {
        u.addresses.forEach(addr => {
          if (addr.city) {
            locations.push({ city: toTitleCase(addr.city), country: addr.country || 'PK', type: 'User' });
          }
        });
      }
      if (u.lastLocation?.city) {
        locations.push({ city: toTitleCase(u.lastLocation.city), country: u.lastLocation.country || 'PK', type: 'Login' });
      }
    });
    allOrders.forEach(o => {
      if (o.shippingAddress?.city) {
        locations.push({ city: toTitleCase(o.shippingAddress.city), country: 'PK', type: 'Order' });
      }
    });

    res.json({ statusCounts, monthRevenue, userGrowth, locations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── End of Routes ────────────────────────────────────────────────────────────

// ── Global Settings ──────────────────────────────────────────────────────────
const GlobalSettings = require('../models/GlobalSettings');

router.get('/settings', async (req, res) => {
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) {
      settings = await GlobalSettings.create({});
    }
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/settings', async (req, res) => {
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) {
      settings = new GlobalSettings(req.body);
    } else {
      Object.assign(settings, req.body);
      settings.updatedAt = Date.now();
    }
    await settings.save();
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
