const express = require('express');
const router = express.Router();
const { createReview, getVehicleReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/vehicle/:vehicleId', getVehicleReviews);
router.post('/', protect, createReview);

module.exports = router;
