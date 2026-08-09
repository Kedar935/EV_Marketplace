import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';

const Cart = () => {
  const { cartItems, pricing, updateQuantity, removeFromCart, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 flex items-center justify-center">
        <EmptyState
          icon={ShoppingCart}
          title="Sign in to view your cart"
          description="Log in to manage your vehicle order and proceed to checkout."
          actionText="Sign In"
          actionLink="/login"
        />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 flex items-center justify-center">
        <EmptyState
          icon={ShoppingCart}
          title="Your Shopping Cart is Empty"
          description="You haven't added any electric vehicles to your shopping cart yet."
          actionText="Explore EVs"
          actionLink="/vehicles"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Shopping Cart
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cartItems.length} Item(s) in Cart</p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs text-red-600 hover:underline font-medium flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-3">
            {cartItems.map((item) => {
              const v = item.vehicle;
              if (!v) return null;

              return (
                <div
                  key={item._id}
                  className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-4"
                >
                  <img
                    src={v.images?.[0] || 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=300&q=80'}
                    alt={v.title}
                    className="w-full sm:w-32 h-24 object-cover rounded-lg shrink-0"
                  />

                  <div className="flex-1 w-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400">{v.brand} · {v.year}</span>
                        <Link to={`/vehicles/${v._id}`}>
                          <h3 className="font-semibold text-base text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors line-clamp-1">
                            {v.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-slate-500 mt-0.5">{v.location} · {v.rangeKm} km Range</p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-base font-bold text-slate-900 dark:text-white">
                        ₹{(v.price / 100000).toFixed(2)} Lakh
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-md">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-2">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing & Checkout Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 sticky top-24">
              <h3 className="font-bold text-base text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Order Summary
              </h3>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{pricing.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (5%)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{pricing.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Flatbed Transport & Delivery</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{pricing.deliveryFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Total</span>
                <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                  ₹{pricing.totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-400 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Stripe Secured Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
