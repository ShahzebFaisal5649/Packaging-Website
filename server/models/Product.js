const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true, unique: true },
  cat: { type: String, default: '' },
  description: { type: String, default: '' },
  price: { type: String, default: '' },
  img: { type: String, default: '' },
  boxType: { type: String, default: '' },
  material: { type: String, default: '' },
  finish: { type: String, default: '' },
  dims: { type: String, default: '' },
  minQty: { type: String, default: '' },
  addons: { type: [String], default: [] },
  suggestedDimensions: {
    l: Number,
    w: Number,
    h: Number,
  },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

productSchema.index({ cat: 1 });

module.exports = mongoose.model('Product', productSchema);
