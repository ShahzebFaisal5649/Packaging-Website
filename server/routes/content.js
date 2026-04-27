const express = require('express');
const Product = require('../models/Product');
const Industry = require('../models/Industry');

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

module.exports = router;
