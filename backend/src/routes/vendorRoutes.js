const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getVendorVehicles,
  createVehicleListing,
  updateVehicleListing,
  deleteVehicleListing,
  markVehicleSold,
  getVendorOrders,
} = require('../controllers/vendorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('VENDOR', 'ADMIN'));

router.get('/dashboard', getDashboardStats);
router.get('/vehicles', getVendorVehicles);
router.post('/vehicles', createVehicleListing);
router.put('/vehicles/:id', updateVehicleListing);
router.delete('/vehicles/:id', deleteVehicleListing);
router.put('/vehicles/:id/mark-sold', markVehicleSold);
router.get('/orders', getVendorOrders);

module.exports = router;
