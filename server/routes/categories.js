const express = require('express');
const router = express.Router();
const { getAllCategories, getCategoryFull, getAllFull } = require('../controllers/categoriesController');

router.get('/all/full', getAllFull);
router.get('/', getAllCategories);
router.get('/:slug/full', getCategoryFull);

module.exports = router;
