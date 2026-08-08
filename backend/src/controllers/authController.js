const User = require('../models/User');
const Vendor = require('../models/Vendor');
const generateToken = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, businessName, businessPhone } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, 'Please provide name, email, and password');
    }

    // Security Guard: PUBLIC REGISTRATION CAN NEVER CREATE ADMIN ACCOUNTS
    if (role === 'ADMIN') {
      return sendError(res, 403, 'Admin accounts cannot be registered publicly.', 'FORBIDDEN');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendError(res, 400, 'User already exists with this email');
    }

    const userRole = role === 'VENDOR' ? 'VENDOR' : 'CUSTOMER';

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: userRole,
    });

    let vendor = null;
    if (userRole === 'VENDOR') {
      vendor = await Vendor.create({
        user: user._id,
        businessName: businessName || `${name}'s Motors`,
        contactPhone: businessPhone || phone || '',
        contactEmail: email,
        status: 'APPROVED', // Default approved for vendor onboarding in market
      });
    }

    const token = generateToken(user._id, user.role);

    return sendSuccess(res, 201, 'User registered successfully', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        vendorId: vendor ? vendor._id : null,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Invalid email or password.', 'INVALID_CREDENTIALS');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password.', 'INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      return sendError(res, 403, 'Your account is suspended. Please contact admin.', 'FORBIDDEN');
    }

    let vendorId = null;
    if (user.role === 'VENDOR') {
      const vendor = await Vendor.findOne({ user: user._id });
      if (vendor) vendorId = vendor._id;
    }

    const token = generateToken(user._id, user.role);

    return sendSuccess(res, 200, 'Logged in successfully', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        address: user.address,
        vendorId,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let vendor = null;

    if (user.role === 'VENDOR') {
      vendor = await Vendor.findOne({ user: user._id });
    }

    return sendSuccess(res, 200, 'Current user profile', {
      user,
      vendor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;
    if (address) {
      user.address = {
        ...user.address,
        ...address,
      };
    }

    await user.save();

    return sendSuccess(res, 200, 'Profile updated successfully', { user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};
