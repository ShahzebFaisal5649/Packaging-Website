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
    
    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({ message: 'You are already subscribed!' });
    }
    
    await Subscriber.create({ email });
    res.status(201).json({ message: 'Successfully subscribed to the newsletter!' });
  } catch (err) {
    res.status(500).json({ message: 'Subscription failed. Please try again later.' });
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

    res.status(201).json({ message: 'Message received', contact });
  } catch (err) {
    res.status(500).json({ message: 'Could not submit contact message. Please try again later.' });
  }
});

module.exports = router;
