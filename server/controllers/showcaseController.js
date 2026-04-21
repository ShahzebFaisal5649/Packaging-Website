const ShowcaseImage = require('../models/ShowcaseImage');

// GET /api/showcase?category=:slug
const getShowcaseImages = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { categorySlug: category } : {};
    const images = await ShowcaseImage.find(filter).sort({ order: 1 }).lean();
    res.json({ success: true, data: images });
  } catch (err) {
    next(err);
  }
};

module.exports = { getShowcaseImages };
