const Vendor = require('../models/Vendor');
const Vehicle = require('../models/Vehicle');
const Order = require('../models/Order');
const Category = require('../models/Category');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// Helper to get logged-in user's vendor profile
const getVendorByUser = async (userId) => {
  let vendor = await Vendor.findOne({ user: userId });
  if (!vendor) {
    // Auto create vendor if missing
    vendor = await Vendor.create({
      user: userId,
      businessName: 'EV Motors Vendor',
      contactPhone: '9876543210',
      contactEmail: 'vendor@evmarketplace.com',
      status: 'APPROVED',
    });
  }
  return vendor;
};

// @desc    Get real MongoDB vendor dashboard metrics
// @route   GET /api/v1/vendor/dashboard
// @access  Private (Vendor)
const getDashboardStats = async (req, res, next) => {
  try {
    const vendor = await getVendorByUser(req.user._id);

    const activeListings = await Vehicle.countDocuments({ vendor: vendor._id, status: 'APPROVED' });
    const pendingListings = await Vehicle.countDocuments({ vendor: vendor._id, status: 'PENDING_APPROVAL' });
    const soldVehicles = await Vehicle.countDocuments({ vendor: vendor._id, status: 'SOLD' });
    const totalVehicles = await Vehicle.countDocuments({ vendor: vendor._id });

    // Fetch vendor orders
    const vendorOrders = await Order.find({ 'items.vendor': vendor._id }).sort({ createdAt: -1 });

    let totalRevenue = 0;
    let orderCount = vendorOrders.length;

    vendorOrders.forEach((order) => {
      if (order.paymentInfo && order.paymentInfo.status === 'PAID') {
        order.items.forEach((item) => {
          if (item.vendor.toString() === vendor._id.toString()) {
            totalRevenue += item.price * item.quantity;
          }
        });
      }
    });

    const recentListings = await Vehicle.find({ vendor: vendor._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentOrders = vendorOrders.slice(0, 5);

    return sendSuccess(res, 200, 'Vendor stats retrieved', {
      vendor,
      stats: {
        activeListings,
        pendingListings,
        soldVehicles,
        totalVehicles,
        orderCount,
        totalRevenue,
        rating: vendor.rating,
      },
      recentListings,
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all vehicle listings for logged-in vendor
// @route   GET /api/v1/vendor/vehicles
// @access  Private (Vendor)
const getVendorVehicles = async (req, res, next) => {
  try {
    const vendor = await getVendorByUser(req.user._id);

    const vehicles = await Vehicle.find({ vendor: vendor._id })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Vendor vehicles retrieved', { vehicles });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new vehicle listing (Status: PENDING_APPROVAL)
// @route   POST /api/v1/vendor/vehicles
// @access  Private (Vendor)
const createVehicleListing = async (req, res, next) => {
  try {
    const vendor = await getVendorByUser(req.user._id);

    const {
      title,
      brand,
      model,
      year,
      price,
      description,
      condition,
      mileage,
      rangeKm,
      batteryCapacityKwh,
      chargingTimeHours,
      topSpeedKmh,
      seatingCapacity,
      bodyType,
      location,
      features,
      images,
      stock = 1,
    } = req.body;

    if (!title || !brand || !model || !year || !price || !rangeKm || !batteryCapacityKwh) {
      return sendError(res, 400, 'Please provide all required vehicle specifications');
    }

    const vehicleImages = Array.isArray(images) && images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80'];

    const vehicle = await Vehicle.create({
      title,
      brand,
      model,
      year: Number(year),
      price: Number(price),
      description: description || `${brand} ${model} Electric Vehicle`,
      condition: condition || 'NEW',
      mileage: Number(mileage || 0),
      rangeKm: Number(rangeKm),
      batteryCapacityKwh: Number(batteryCapacityKwh),
      chargingTimeHours: Number(chargingTimeHours || 4),
      topSpeedKmh: Number(topSpeedKmh || 160),
      seatingCapacity: Number(seatingCapacity || 5),
      bodyType: bodyType || 'SUV',
      location: location || 'Mumbai',
      features: Array.isArray(features) ? features : (features ? features.split(',') : ['Fast Charging', 'Autopilot']),
      images: vehicleImages,
      vendor: vendor._id,
      status: 'PENDING_APPROVAL',
      stock: Number(stock),
    });

    return sendSuccess(res, 201, 'Vehicle listing submitted for admin approval', { vehicle });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing vehicle listing
// @route   PUT /api/v1/vendor/vehicles/:id
// @access  Private (Vendor)
const updateVehicleListing = async (req, res, next) => {
  try {
    const vendor = await getVendorByUser(req.user._id);
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return sendError(res, 404, 'Vehicle not found');
    }

    if (vehicle.vendor.toString() !== vendor._id.toString() && req.user.role !== 'ADMIN') {
      return sendError(res, 403, 'Not authorized to edit this listing');
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return sendSuccess(res, 200, 'Vehicle updated successfully', { vehicle: updatedVehicle });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vehicle listing
// @route   DELETE /api/v1/vendor/vehicles/:id
// @access  Private (Vendor)
const deleteVehicleListing = async (req, res, next) => {
  try {
    const vendor = await getVendorByUser(req.user._id);
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return sendError(res, 404, 'Vehicle not found');
    }

    if (vehicle.vendor.toString() !== vendor._id.toString() && req.user.role !== 'ADMIN') {
      return sendError(res, 403, 'Not authorized to delete this listing');
    }

    await Vehicle.findByIdAndDelete(id);

    return sendSuccess(res, 200, 'Vehicle listing deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Mark vehicle status as SOLD
// @route   PUT /api/v1/vendor/vehicles/:id/mark-sold
// @access  Private (Vendor)
const markVehicleSold = async (req, res, next) => {
  try {
    const vendor = await getVendorByUser(req.user._id);
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return sendError(res, 404, 'Vehicle not found');
    }

    if (vehicle.vendor.toString() !== vendor._id.toString()) {
      return sendError(res, 403, 'Not authorized to modify this listing');
    }

    vehicle.status = 'SOLD';
    vehicle.stock = 0;
    await vehicle.save();

    return sendSuccess(res, 200, 'Vehicle marked as sold', { vehicle });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor orders
// @route   GET /api/v1/vendor/orders
// @access  Private (Vendor)
const getVendorOrders = async (req, res, next) => {
  try {
    const vendor = await getVendorByUser(req.user._id);

    const orders = await Order.find({ 'items.vendor': vendor._id })
      .populate('customer', 'name email phone')
      .populate('items.vehicle', 'title images brand model')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Vendor orders retrieved', { orders });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getVendorVehicles,
  createVehicleListing,
  updateVehicleListing,
  deleteVehicleListing,
  markVehicleSold,
  getVendorOrders,
};
