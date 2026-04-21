const mongoose = require('mongoose');

const showcaseImageSchema = new mongoose.Schema(
  {
    categorySlug: { type: String, required: true, index: true },
    src: { type: String, required: true },
    alt: { type: String, default: '' },
    designerName: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShowcaseImage', showcaseImageSchema);
