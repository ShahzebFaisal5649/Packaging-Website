const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true, unique: true },
  cat: { type: String, default: '' },
  description: { type: String, default: '' },
  img: { type: String, default: '' },
  products: { type: [{ name: String, img: String }], default: [] },
  createdAt: { type: Date, default: Date.now },
});

// Index already created by unique: true

module.exports = mongoose.model('Industry', industrySchema);
