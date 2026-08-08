const Cart = require('../models/Cart');
const Vehicle = require('../models/Vehicle');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Get user cart
// @route   GET /api/v1/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.vehicle',
      populate: { path: 'vendor', select: 'businessName logo' },
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Filter out items where vehicle might have been deleted or sold
    const activeItems = cart.items.filter(
      (item) => item.vehicle && item.vehicle.status === 'APPROVED' && item.vehicle.stock > 0
    );

    // Calculate cart totals
    let subtotal = 0;
    activeItems.forEach((item) => {
      subtotal += item.vehicle.price * item.quantity;
    });

    const tax = Math.round(subtotal * 0.05); // 5% GST/Tax
    const deliveryFee = subtotal > 0 ? 15000 : 0; // Flat delivery registration fee
    const totalPrice = subtotal + tax + deliveryFee;

    return sendSuccess(res, 200, 'Cart retrieved', {
      cartId: cart._id,
      items: activeItems,
      pricing: {
        subtotal,
        tax,
        deliveryFee,
        totalPrice,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add vehicle to cart
// @route   POST /api/v1/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { vehicleId, quantity = 1 } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return sendError(res, 404, 'Vehicle not found');
    }

    if (vehicle.status !== 'APPROVED') {
      return sendError(res, 400, 'This vehicle is not available for purchase');
    }

    if (vehicle.stock < 1) {
      return sendError(res, 400, 'Vehicle is out of stock / sold out');
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.vehicle.toString() === vehicleId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
      cart.items[itemIndex].priceAtAddition = vehicle.price;
    } else {
      cart.items.push({
        vehicle: vehicleId,
        quantity: Number(quantity),
        priceAtAddition: vehicle.price,
      });
    }

    await cart.save();

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return sendError(res, 404, 'Cart not found');
    }

    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return sendError(res, 404, 'Item not found in cart');
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = Number(quantity);
    }

    await cart.save();

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove vehicle from cart
// @route   DELETE /api/v1/cart/:itemId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return sendError(res, 404, 'Cart not found');
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/v1/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return sendSuccess(res, 200, 'Cart cleared successfully', { items: [], pricing: { subtotal: 0, tax: 0, deliveryFee: 0, totalPrice: 0 } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
