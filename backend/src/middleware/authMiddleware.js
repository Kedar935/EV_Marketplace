const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'ev_marketplace_super_secret_jwt_key_2026_secure'
      );

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return sendError(res, 401, 'User not found with provided authorization token.', 'UNAUTHORIZED');
      }

      if (!user.isActive) {
        return sendError(res, 403, 'Your account has been suspended. Please contact support.', 'FORBIDDEN');
      }

      req.user = user;
      next();
    } catch (error) {
      return sendError(res, 401, 'Not authorized, token validation failed.', 'UNAUTHORIZED');
    }
  }

  if (!token) {
    return sendError(res, 401, 'Not authorized, no token provided.', 'UNAUTHORIZED');
  }
};

const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'ev_marketplace_super_secret_jwt_key_2026_secure'
      );
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Ignore token failure for optional auth
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
