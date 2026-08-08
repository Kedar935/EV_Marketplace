const express = require('express');
const router = express.Router();
const { recommendVehicles, parseNaturalLanguageQuery } = require('../controllers/aiController');

router.post('/recommend', recommendVehicles);
router.post('/parse-query', parseNaturalLanguageQuery);

module.exports = router;
