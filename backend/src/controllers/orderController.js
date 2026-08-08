const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Vehicle = require('../models/Vehicle');
const Vendor = require('../models/Vendor');
const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// Generate unique order number
const generateOrderNumber = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `EV-ORD-${Date.now().toString().slice(-6)}-${randomNum}`;
};

// @desc    Create a new order from Cart or direct Buy Now
// @route   POST /api/v1/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod = 'STRIPE' } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendError(res, 400, 'Order items are required');
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
      return sendError(res, 400, 'Complete shipping address is required');
    }

    // Validate inventory and calculate totals server-side
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const vehicle = await Vehicle.findById(item.vehicleId || item.vehicle);
      if (!vehicle) {
        return sendError(res, 404, `Vehicle not found: ${item.vehicleId}`);
      }

      if (vehicle.status !== 'APPROVED') {
        return sendError(res, 400, `Vehicle '${vehicle.title}' is not available for sale.`);
      }

      if (vehicle.stock < (item.quantity || 1)) {
        return sendError(res, 400, `Vehicle '${vehicle.title}' is out of stock.`);
      }

      const itemPrice = vehicle.price;
      const itemSubtotal = itemPrice * (item.quantity || 1);
      subtotal += itemSubtotal;

      validatedItems.push({
        vehicle: vehicle._id,
        title: vehicle.title,
        brand: vehicle.brand,
        model: vehicle.model,
        image: vehicle.images[0] || '',
        quantity: item.quantity || 1,
        price: itemPrice,
        vendor: vehicle.vendor,
      });
    }

    const tax = Math.round(subtotal * 0.05); // 5% tax
    const deliveryFee = 15000; // standard delivery & registration fee
    const totalPrice = subtotal + tax + deliveryFee;

    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      customer: req.user._id,
      items: validatedItems,
      shippingAddress: {
        name: shippingAddress.name || req.user.name,
        phone: shippingAddress.phone || req.user.phone,
        email: shippingAddress.email || req.user.email,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: shippingAddress.country || 'India',
      },
      paymentInfo: {
        id: '',
        status: 'PENDING',
        method: paymentMethod,
      },
      pricing: {
        subtotal,
        tax,
        deliveryFee,
        totalPrice,
      },
      orderStatus: 'PENDING',
      statusHistory: [
        {
          status: 'PENDING',
          description: 'Order placed, waiting for payment confirmation.',
        },
      ],
    });

    // Clear cart after order creation
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    return sendSuccess(res, 201, 'Order created successfully', { order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('items.vehicle', 'title brand model year rangeKm images')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Customer orders retrieved', { orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID or Order Number
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let order = await Order.findById(id)
      .populate('customer', 'name email phone')
      .populate('items.vehicle')
      .populate('items.vendor', 'businessName logo contactPhone contactEmail');

    if (!order) {
      order = await Order.findOne({ orderNumber: id })
        .populate('customer', 'name email phone')
        .populate('items.vehicle')
        .populate('items.vendor', 'businessName logo contactPhone contactEmail');
    }

    if (!order) {
      return sendError(res, 404, 'Order not found', 'NOT_FOUND');
    }

    // Access check: Customer, Vendor of items in order, or Admin
    const isCustomer = order.customer._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';
    let isOrderVendor = false;

    if (req.user.role === 'VENDOR') {
      const vendorObj = await Vendor.findOne({ user: req.user._id });
      if (vendorObj) {
        isOrderVendor = order.items.some(
          (item) => item.vendor && item.vendor._id.toString() === vendorObj._id.toString()
        );
      }
    }

    if (!isCustomer && !isAdmin && !isOrderVendor) {
      return sendError(res, 403, 'Not authorized to view this order', 'FORBIDDEN');
    }

    return sendSuccess(res, 200, 'Order details retrieved', { order });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order fulfillment status (Vendor/Admin)
// @route   PUT /api/v1/orders/:id/status
// @access  Private (Vendor / Admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, description } = req.body;
    const { id } = req.params;

    const allowedStatuses = [
      'PENDING',
      'CONFIRMED',
      'PROCESSING',
      'SHIPPED',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'CANCELLED',
    ];

    if (!allowedStatuses.includes(status)) {
      return sendError(res, 400, 'Invalid order status');
    }

    const order = await Order.findById(id);
    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      description: description || `Order status updated to ${status}`,
      updatedAt: new Date(),
    });

    await order.save();

    // Create notification for customer
    await Notification.create({
      user: order.customer,
      title: `Order #${order.orderNumber} Status Updated`,
      message: `Your order status is now: ${status.replace(/_/g, ' ')}`,
      type: 'ORDER_STATUS',
      link: `/orders/${order._id}`,
    });

    return sendSuccess(res, 200, 'Order status updated', { order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
