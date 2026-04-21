const Subcategory = require('../models/Subcategory');

// GET /api/subcategories?category=:slug
const getSubcategories = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { categorySlug: category } : {};
    const items = await Subcategory.find(filter).sort({ order: 1 }).lean();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

// GET /api/subcategories/:slug
const getSubcategoryBySlug = async (req, res, next) => {
  try {
    const item = await Subcategory.findOne({ slug: req.params.slug }).lean();
    if (!item) return res.status(404).json({ success: false, message: 'Subcategory not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSubcategories, getSubcategoryBySlug };
