const express = require('express');
const Product = require('../models/Product');
const Industry = require('../models/Industry');
const Subscriber = require('../models/Subscriber');
const ContactMessage = require('../models/ContactMessage');
const Quote = require('../models/Quote');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// Public content endpoints
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments()
    ]);
    res.json({ products, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/featured-products', async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const query = { $or: [{ _id: req.params.id }, { slug: req.params.id }] };
    const product = await Product.findOne(query);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/industries', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [industries, total] = await Promise.all([
      Industry.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Industry.countDocuments()
    ]);
    res.json({ industries, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/industries/:id', async (req, res) => {
  try {
    const query = { $or: [{ _id: req.params.id }, { slug: req.params.id }] };
    const industry = await Industry.findOne(query);
    if (!industry) return res.status(404).json({ message: 'Industry not found' });
    res.json({ industry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const existing = await Subscriber.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(200).json({ message: 'You are already subscribed!' });
    }

    await Subscriber.create({ email: email.toLowerCase().trim() });
    res.status(201).json({ message: 'Successfully subscribed to the newsletter!' });
  } catch (err) {
    console.error('Subscribe error:', err);
    res.status(500).json({ message: 'Subscription failed: ' + err.message });
  }
});

router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, company, subject, message, interests } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject, and message are required.' });
    }

    const contact = await ContactMessage.create({
      name,
      email,
      phone,
      company,
      subject,
      message,
      interests: Array.isArray(interests) ? interests : [],
    });

    // Send notification to Admin
    await sendEmail({
      email: "designcustombox@gmail.com",
      subject: `New Contact Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Contact Inquiry</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">${message}</div>
        </div>
      `
    });

    // Send auto-reply to User
    await sendEmail({
      email: email,
      subject: "We've Received Your Message - Design Custom Box",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h3>Hello ${name},</h3>
          <p>Thank you for reaching out to Design Custom Box. We've received your message regarding "${subject}" and our team will get back to you as soon as possible.</p>
          <p>Best Regards,<br/>The Design Custom Box Team</p>
        </div>
      `
    });

    res.status(201).json({ message: 'Message received! We\'ll be in touch soon.', contact });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ message: 'Could not submit: ' + err.message });
  }
});



// Public guest sample/quote request (no auth needed)
router.post('/guest-quote', async (req, res) => {
  try {
    const { name, email, phone, ...quoteData } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    // Find or create a user record for this guest
    const User = require('../models/User');
    let guestUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (!guestUser) {
      // Create a minimal guest account with a random password they won't use
      const crypto = require('crypto');
      guestUser = await User.create({
        name,
        email: email.toLowerCase().trim(),
        password: crypto.randomBytes(16).toString('hex'),
        phone: phone || '',
        role: 'user',
        loyaltyPoints: 0,
      });
    }
    const quote = await Quote.create({
      quoteId: `QT-${Date.now()}`,
      userId: guestUser._id,
      userName: guestUser.name,
      userEmail: guestUser.email,
      ...quoteData,
    });

    // Send Quote Confirmation Email
    await sendEmail({
      email: guestUser.email,
      subject: "Your Sample Request Received - Design Custom Box",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h3>Hello ${name},</h3>
          <p>Thank you for your sample request (ID: ${quote.quoteId}). We're reviewing your specifications and will provide you with a quote shortly.</p>
          <p>Best Regards,<br/>The Design Custom Box Team</p>
        </div>
      `
    });

    res.status(201).json({ message: 'Sample request submitted successfully', quote });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Could not submit sample request' });
  }
});

module.exports = router;