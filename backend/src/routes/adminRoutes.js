const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  toggleUserStatus,
  getVendors,
  updateVendorStatus,
  getPendingVehicleApprovals,
  approveVehicleListing,
  rejectVehicleListing,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/dashboard', getAdminStats);
router.get('/users', getUsers);
router.put('/users/:id/status', toggleUserStatus);
router.get('/vendors', getVendors);
router.put('/vendors/:id/status', updateVendorStatus);
router.get('/vehicles/pending', getPendingVehicleApprovals);
router.put('/vehicles/:id/approve', approveVehicleListing);
router.put('/vehicles/:id/reject', rejectVehicleListing);

module.exports = router;
