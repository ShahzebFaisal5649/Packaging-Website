const express = require('express');
const router = express.Router();
const { getShowcaseImages } = require('../controllers/showcaseController');

router.get('/', getShowcaseImages);

module.exports = router;
