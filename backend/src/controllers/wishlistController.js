const Wishlist = require('../models/Wishlist');
const Vehicle = require('../models/Vehicle');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Get user wishlist
// @route   GET /api/v1/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'vehicles',
      populate: { path: 'vendor', select: 'businessName logo rating' },
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, vehicles: [] });
    }

    return sendSuccess(res, 200, 'Wishlist retrieved', { wishlist: wishlist.vehicles });
  } catch (error) {
    next(error);
  }
};

// @desc    Add vehicle to wishlist
// @route   POST /api/v1/wishlist
// @access  Private
const addToWishlist = async (req, res, next) => {
  try {
    const { vehicleId } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return sendError(res, 404, 'Vehicle not found');
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, vehicles: [] });
    }

    const alreadyAdded = wishlist.vehicles.some(
      (id) => id.toString() === vehicleId
    );

    if (!alreadyAdded) {
      wishlist.vehicles.push(vehicleId);
      await wishlist.save();
    }

    await wishlist.populate({
      path: 'vehicles',
      populate: { path: 'vendor', select: 'businessName logo rating' },
    });

    return sendSuccess(res, 200, 'Vehicle added to wishlist', { wishlist: wishlist.vehicles });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove vehicle from wishlist
// @route   DELETE /api/v1/wishlist/:vehicleId
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return sendSuccess(res, 200, 'Vehicle removed from wishlist', { wishlist: [] });
    }

    wishlist.vehicles = wishlist.vehicles.filter(
      (id) => id.toString() !== vehicleId
    );

    await wishlist.save();

    await wishlist.populate({
      path: 'vehicles',
      populate: { path: 'vendor', select: 'businessName logo rating' },
    });

    return sendSuccess(res, 200, 'Vehicle removed from wishlist', { wishlist: wishlist.vehicles });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
