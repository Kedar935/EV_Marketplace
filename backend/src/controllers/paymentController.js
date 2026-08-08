const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Vehicle = require('../models/Vehicle');
const Vendor = require('../models/Vendor');
const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// Initialize Stripe if valid key exists
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
  try {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  } catch (e) {
    console.log('Stripe SDK load notice:', e.message);
  }
}

// @desc    Create Stripe Payment Intent
// @route   POST /api/v1/payments/create-intent
// @access  Private
const createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    if (order.customer.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Not authorized for this order');
    }

    const amountInPaise = Math.round(order.pricing.totalPrice * 100);

    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInPaise,
        currency: 'inr',
        metadata: {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          userId: req.user._id.toString(),
        },
      });

      return sendSuccess(res, 200, 'Stripe Payment Intent created', {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: order.pricing.totalPrice,
      });
    } else {
      // Development mode payment session
      const mockPaymentIntentId = `pi_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      return sendSuccess(res, 200, 'Development Payment Intent generated', {
        clientSecret: `${mockPaymentIntentId}_secret_mock`,
        paymentIntentId: mockPaymentIntentId,
        amount: order.pricing.totalPrice,
        isDevMode: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Stripe Payment and Complete Order
// @route   POST /api/v1/payments/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    if (order.paymentInfo.status === 'PAID') {
      return sendSuccess(res, 200, 'Order is already marked as paid', { order });
    }

    let isSuccess = true;
    if (stripe && paymentIntentId && !paymentIntentId.startsWith('pi_mock')) {
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      isSuccess = intent.status === 'succeeded';
    }

    if (!isSuccess) {
      order.paymentInfo.status = 'FAILED';
      await order.save();
      return sendError(res, 400, 'Payment verification failed', 'PAYMENT_FAILED');
    }

    // Update order status to CONFIRMED and payment to PAID
    order.paymentInfo = {
      id: paymentIntentId || `pi_mock_${Date.now()}`,
      status: 'PAID',
      method: 'STRIPE',
      paidAt: new Date(),
    };
    order.orderStatus = 'CONFIRMED';
    order.statusHistory.push({
      status: 'CONFIRMED',
      description: 'Payment successfully received and verified.',
      updatedAt: new Date(),
    });

    await order.save();

    // Record Payment
    await Payment.create({
      order: order._id,
      user: req.user._id,
      stripePaymentIntentId: paymentIntentId || `pi_mock_${Date.now()}`,
      amount: order.pricing.totalPrice,
      currency: 'inr',
      status: 'SUCCEEDED',
    });

    // Deduct vehicle stock and update vendor statistics
    for (const item of order.items) {
      const vehicle = await Vehicle.findById(item.vehicle);
      if (vehicle) {
        vehicle.stock = Math.max(0, vehicle.stock - item.quantity);
        if (vehicle.stock === 0) {
          vehicle.status = 'SOLD';
        }
        await vehicle.save();

        // Update vendor totals
        if (vehicle.vendor) {
          const vendor = await Vendor.findById(vehicle.vendor);
          if (vendor) {
            vendor.totalSales += item.quantity;
            vendor.revenue += item.price * item.quantity;
            await vendor.save();

            // Notify vendor
            await Notification.create({
              user: vendor.user,
              title: 'New Vehicle Order Received!',
              message: `You received an order for ${vehicle.title} (Order #${order.orderNumber}).`,
              type: 'NEW_ORDER',
              link: `/vendor/orders`,
            });
          }
        }
      }
    }

    // Create notification for customer
    await Notification.create({
      user: req.user._id,
      title: 'Payment Successful & Order Confirmed',
      message: `Your order #${order.orderNumber} for ₹${order.pricing.totalPrice.toLocaleString()} has been confirmed!`,
      type: 'ORDER_STATUS',
      link: `/orders/${order._id}`,
    });

    return sendSuccess(res, 200, 'Payment verified and order confirmed successfully', { order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentIntent,
  verifyPayment,
};
