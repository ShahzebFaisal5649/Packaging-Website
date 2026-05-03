const express = require('express');
const Product = require('../models/Product');
const Industry = require('../models/Industry');
const Subscriber = require('../models/Subscriber');
const ContactMessage = require('../models/ContactMessage');

const router = express.Router();

// Public content endpoints
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
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
    const industries = await Industry.find().sort({ createdAt: -1 });
    res.json({ industries });
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
    const quote = {
      quoteId: `QT-${Date.now()}`,
      ...quoteData,
      createdAt: new Date(),
    };
    guestUser.quotes.push(quote);
    await guestUser.save();
    res.status(201).json({ message: 'Sample request submitted successfully', quote });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Could not submit sample request' });
  }
});

module.exports = router;