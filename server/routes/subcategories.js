const express = require('express');
const router = express.Router();
const { getSubcategories, getSubcategoryBySlug } = require('../controllers/subcategoriesController');

router.get('/', getSubcategories);
router.get('/:slug', getSubcategoryBySlug);

module.exports = router;
