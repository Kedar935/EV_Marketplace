const express = require('express');
const router = express.Router();
const {
  calculateRangeUsage,
  calculateChargingCost,
  calculateTcoSavings,
} = require('../controllers/calculatorController');

router.post('/range', calculateRangeUsage);
router.post('/charging-cost', calculateChargingCost);
router.post('/tco', calculateTcoSavings);

module.exports = router;
