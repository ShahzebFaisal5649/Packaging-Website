const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const ShowcaseImage = require('../models/ShowcaseImage');

// GET /api/categories
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ order: 1 }).lean();
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

// GET /api/categories/all/full — single request for the whole page
const getAllFull = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ order: 1 }).lean();
    const slugs = categories.map((c) => c.slug);

    const [subcategories, showcaseImages] = await Promise.all([
      Subcategory.find({ categorySlug: { $in: slugs } }).sort({ order: 1 }).lean(),
      ShowcaseImage.find({ categorySlug: { $in: slugs } }).sort({ order: 1 }).lean(),
    ]);

    const subMap = {};
    const imgMap = {};
    subcategories.forEach((s) => {
      if (!subMap[s.categorySlug]) subMap[s.categorySlug] = [];
      subMap[s.categorySlug].push(s);
    });
    showcaseImages.forEach((i) => {
      if (!imgMap[i.categorySlug]) imgMap[i.categorySlug] = [];
      imgMap[i.categorySlug].push(i);
    });

    const result = categories.map((c) => ({
      ...c,
      subcategories: subMap[c.slug] || [],
      showcaseImages: imgMap[c.slug] || [],
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// GET /api/categories/:slug/full
const getCategoryFull = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const [category, subcategories, showcaseImages] = await Promise.all([
      Category.findOne({ slug }).lean(),
      Subcategory.find({ categorySlug: slug }).sort({ order: 1 }).lean(),
      ShowcaseImage.find({ categorySlug: slug }).sort({ order: 1 }).lean(),
    ]);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: { ...category, subcategories, showcaseImages } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllCategories, getCategoryFull, getAllFull };
