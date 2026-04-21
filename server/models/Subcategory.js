const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema(
  {
    categorySlug: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, default: '' },
    isBundle: { type: Boolean, default: false },
    features: { type: [String], default: [] },
    saveBadge: { type: String, default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subcategory', subcategorySchema);
