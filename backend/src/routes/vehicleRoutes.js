const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getFeaturedVehicles,
  getVehicleById,
  compareVehicles,
} = require('../controllers/vehicleController');

router.get('/', getVehicles);
router.get('/featured', getFeaturedVehicles);
router.post('/compare', compareVehicles);
router.get('/:id', getVehicleById);

module.exports = router;
