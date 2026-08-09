import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';

const Checkout = () => {
  const { cartItems, pricing, clearCart } = useCart();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '9876543210',
    street: user?.address?.street || '42 Green Park Extension',
    city: user?.address?.city || 'New Delhi',
    state: user?.address?.state || 'Delhi',
    pincode: user?.address?.pincode || '110016',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('STRIPE');
  const [processing, setProcessing] = useState(false);

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrderAndPay = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.pincode) {
      showError('Please complete all delivery address fields');
      return;
    }

    try {
      setProcessing(true);

      // STEP 1: Create Order in MongoDB
      const orderPayload = {
        items: cartItems.map((item) => ({
          vehicleId: item.vehicle._id,
          quantity: item.quantity,
        })),
        shippingAddress: address,
        paymentMethod,
      };

      const orderRes = await API.post('/orders', orderPayload);
      const order = orderRes.data.order;

      // STEP 2: Create Payment Intent Backend
      const intentRes = await API.post('/payments/create-intent', {
        orderId: order._id,
      });

      const { paymentIntentId } = intentRes.data;

      // STEP 3: Server-Side Payment Verification & Inventory Stock Deduction
      const verifyRes = await API.post('/payments/verify', {
        orderId: order._id,
        paymentIntentId: paymentIntentId || `pi_mock_${Date.now()}`,
      });

      showSuccess('Payment Successful! Order Confirmed.');
      clearCart();
      navigate(`/orders/${order._id}/track`);
    } catch (err) {
      showError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
          Checkout
        </h1>

        <form onSubmit={handlePlaceOrderAndPay} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Shipping & Payment Column */}
          <div className="lg:col-span-7 space-y-5">
            {/* Delivery Address Card */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white pb-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Truck className="w-4 h-4 text-teal-600" />
                Delivery Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white pb-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-teal-600" />
                Payment Method
              </h3>

              <div className="p-3.5 rounded-lg border border-teal-600 bg-teal-50/50 dark:bg-teal-950/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-teal-600 text-white flex items-center justify-center font-bold">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Stripe Online Payment</h4>
                    <p className="text-[11px] text-slate-500">Secured server-side payment verification</p>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
              </div>
            </div>
          </div>

          {/* Order Review Column */}
          <div className="lg:col-span-5">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 sticky top-24">
              <h3 className="font-bold text-base text-slate-900 dark:text-white pb-2.5 border-b border-slate-100 dark:border-slate-800">
                Order Review
              </h3>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900 dark:text-white">{item.quantity}x</span>
                      <span className="text-slate-700 dark:text-slate-300 line-clamp-1">{item.vehicle?.title}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{((item.vehicle?.price * item.quantity) / 100000).toFixed(2)} Lakh
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{pricing.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Taxes (5%)</span>
                  <span>₹{pricing.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Flatbed Transport & Delivery</span>
                  <span>₹{pricing.deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Total Payable</span>
                  <span className="text-teal-600 dark:text-teal-400">₹{pricing.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {processing ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <span>Pay ₹{pricing.totalPrice.toLocaleString()} & Confirm Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
