const Review = require('../models/Review');
const Order = require('../models/Order');
const Vehicle = require('../models/Vehicle');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Create a customer review for a vehicle
// @route   POST /api/v1/reviews
// @access  Private (Customer who purchased vehicle)
const createReview = async (req, res, next) => {
  try {
    const { vehicleId, orderId, rating, comment } = req.body;

    if (!vehicleId || !orderId || !rating || !comment) {
      return sendError(res, 400, 'Vehicle ID, Order ID, rating (1-5), and comment are required');
    }

    if (rating < 1 || rating > 5) {
      return sendError(res, 400, 'Rating must be between 1 and 5 stars');
    }

    // STRICT PURCHASE VERIFICATION: Only customers who bought the vehicle in a paid/confirmed order can review!
    const order = await Order.findOne({
      _id: orderId,
      customer: req.user._id,
      'paymentInfo.status': 'PAID',
      'items.vehicle': vehicleId,
    });

    if (!order) {
      return sendError(
        res,
        403,
        'You can only submit reviews for electric vehicles you have actually purchased and paid for.',
        'FORBIDDEN'
      );
    }

    // Prevent duplicate reviews for same vehicle & order
    const existingReview = await Review.findOne({
      vehicle: vehicleId,
      user: req.user._id,
      order: orderId,
    });

    if (existingReview) {
      return sendError(res, 400, 'You have already submitted a review for this purchase.');
    }

    const review = await Review.create({
      vehicle: vehicleId,
      user: req.user._id,
      order: orderId,
      rating: Number(rating),
      comment: comment.trim(),
    });

    await review.populate('user', 'name avatar');

    return sendSuccess(res, 201, 'Review submitted successfully', { review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a vehicle
// @route   GET /api/v1/reviews/vehicle/:vehicleId
// @access  Public
const getVehicleReviews = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;

    const reviews = await Review.find({ vehicle: vehicleId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    const ratingStats = {
      total: reviews.length,
      average: 5.0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };

    if (reviews.length > 0) {
      let sum = 0;
      reviews.forEach((rev) => {
        sum += rev.rating;
        ratingStats.distribution[rev.rating] = (ratingStats.distribution[rev.rating] || 0) + 1;
      });
      ratingStats.average = Math.round((sum / reviews.length) * 10) / 10;
    }

    return sendSuccess(res, 200, 'Vehicle reviews retrieved', {
      reviews,
      stats: ratingStats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getVehicleReviews,
};
