const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Vehicle = require('../models/Vehicle');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Get real MongoDB admin metrics & aggregation charts
// @route   GET /api/v1/admin/dashboard
// @access  Private (Admin)
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'CUSTOMER' });
    const totalVendors = await Vendor.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingListings = await Vehicle.countDocuments({ status: 'PENDING_APPROVAL' });
    const pendingVendors = await Vendor.countDocuments({ status: 'PENDING_APPROVAL' });

    // Calculate total revenue from paid orders
    const paidOrders = await Order.find({ 'paymentInfo.status': 'PAID' });
    const totalRevenue = paidOrders.reduce((sum, ord) => sum + (ord.pricing.totalPrice || 0), 0);

    // Aggregation for top EV brands
    const topBrands = await Vehicle.aggregate([
      { $match: { status: 'APPROVED' } },
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Aggregation for body type distribution
    const bodyTypesDist = await Vehicle.aggregate([
      { $match: { status: 'APPROVED' } },
      { $group: { _id: '$bodyType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Orders timeline / monthly distribution
    const salesOverTime = await Order.aggregate([
      { $match: { 'paymentInfo.status': 'PAID' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$pricing.totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 14 },
    ]);

    const recentOrders = await Order.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    const pendingApprovals = await Vehicle.find({ status: 'PENDING_APPROVAL' })
      .populate('vendor', 'businessName logo')
      .sort({ createdAt: -1 })
      .limit(5);

    return sendSuccess(res, 200, 'Admin metrics retrieved', {
      metrics: {
        totalUsers,
        totalVendors,
        totalVehicles,
        totalOrders,
        totalRevenue,
        pendingListings,
        pendingVendors,
      },
      charts: {
        topBrands,
        bodyTypesDist,
        salesOverTime,
      },
      recentOrders,
      pendingApprovals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search and filter
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
const getUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Users retrieved', { users });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (Active / Suspended)
// @route   PUT /api/v1/admin/users/:id/status
// @access  Private (Admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    if (user.role === 'ADMIN') {
      return sendError(res, 403, 'Cannot suspend another Admin account');
    }

    user.isActive = isActive !== undefined ? isActive : !user.isActive;
    await user.save();

    return sendSuccess(res, 200, `User account ${user.isActive ? 'activated' : 'suspended'}`, { user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all vendors
// @route   GET /api/v1/admin/vendors
// @access  Private (Admin)
const getVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find()
      .populate('user', 'name email phone avatar isActive')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Vendors retrieved', { vendors });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or Reject Vendor
// @route   PUT /api/v1/admin/vendors/:id/status
// @access  Private (Admin)
const updateVendorStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // APPROVED, REJECTED, SUSPENDED
    const { id } = req.params;

    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return sendError(res, 404, 'Vendor not found');
    }

    vendor.status = status;
    await vendor.save();

    return sendSuccess(res, 200, `Vendor status updated to ${status}`, { vendor });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending vehicle listing approvals
// @route   GET /api/v1/admin/vehicles/pending
// @access  Private (Admin)
const getPendingVehicleApprovals = async (req, res, next) => {
  try {
    const pendingVehicles = await Vehicle.find({ status: 'PENDING_APPROVAL' })
      .populate('vendor', 'businessName logo rating contactPhone contactEmail')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Pending vehicle listings retrieved', { pendingVehicles });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve vehicle listing
// @route   PUT /api/v1/admin/vehicles/:id/approve
// @access  Private (Admin)
const approveVehicleListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id).populate('vendor');
    if (!vehicle) {
      return sendError(res, 404, 'Vehicle not found');
    }

    vehicle.status = 'APPROVED';
    vehicle.rejectionReason = '';
    await vehicle.save();

    // Create Notification for Vendor
    if (vehicle.vendor && vehicle.vendor.user) {
      await Notification.create({
        user: vehicle.vendor.user,
        title: 'Listing Approved!',
        message: `Your EV listing "${vehicle.title}" has been approved and is now live on the marketplace.`,
        type: 'LISTING_APPROVAL',
        link: `/vehicles/${vehicle._id}`,
      });
    }

    return sendSuccess(res, 200, 'Vehicle listing approved successfully', { vehicle });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject vehicle listing with reason
// @route   PUT /api/v1/admin/vehicles/:id/reject
// @access  Private (Admin)
const rejectVehicleListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return sendError(res, 400, 'Rejection reason is required');
    }

    const vehicle = await Vehicle.findById(id).populate('vendor');
    if (!vehicle) {
      return sendError(res, 404, 'Vehicle not found');
    }

    vehicle.status = 'REJECTED';
    vehicle.rejectionReason = rejectionReason;
    await vehicle.save();

    // Create Notification for Vendor
    if (vehicle.vendor && vehicle.vendor.user) {
      await Notification.create({
        user: vehicle.vendor.user,
        title: 'Listing Rejected',
        message: `Your EV listing "${vehicle.title}" was rejected. Reason: ${rejectionReason}`,
        type: 'LISTING_REJECTION',
        link: `/vendor/vehicles`,
      });
    }

    return sendSuccess(res, 200, 'Vehicle listing rejected', { vehicle });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getUsers,
  toggleUserStatus,
  getVendors,
  updateVendorStatus,
  getPendingVehicleApprovals,
  approveVehicleListing,
  rejectVehicleListing,
};
