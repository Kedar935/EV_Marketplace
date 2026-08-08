import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  ShieldCheck,
  MapPin,
  Calendar,
  AlertCircle,
  Star,
} from 'lucide-react';
import { DetailSkeleton } from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import API from '../services/api';
import Badge from '../components/Badge';
import { useToast } from '../context/ToastContext';

const STATUS_STEPS = [
  { key: 'PENDING', label: 'Order Placed', desc: 'Order details received in system' },
  { key: 'CONFIRMED', label: 'Confirmed', desc: 'Payment verified & battery checked' },
  { key: 'PROCESSING', label: 'Processing', desc: 'Vehicle prepped & pre-delivery inspection' },
  { key: 'SHIPPED', label: 'Shipped', desc: 'Dispatched on enclosed flatbed transporter' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Transporter approaching your area' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Handed over at doorstep' },
];

const OrderTracking = () => {
  const { id } = useParams();
  const { showSuccess, showError } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get(`/orders/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      setError(err.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) return <DetailSkeleton />;
  if (error || !order) return <ErrorState message={error || 'Order not found'} onRetry={fetchOrder} />;

  const getStepIndex = (statusKey) => {
    return STATUS_STEPS.findIndex((step) => step.key === statusKey);
  };

  const currentStepIndex = getStepIndex(order.orderStatus);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicle || !comment.trim()) return;

    try {
      setSubmittingReview(true);
      await API.post('/reviews', {
        vehicleId: selectedVehicle._id || selectedVehicle,
        orderId: order._id,
        rating,
        comment,
      });
      showSuccess('Thank you for your verified customer review!');
      setShowReviewModal(false);
      setComment('');
    } catch (err) {
      showError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-400">Order Number</span>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                {order.orderNumber}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={order.paymentInfo?.status === 'PAID' ? 'success' : 'warning'}>
                Payment: {order.paymentInfo?.status}
              </Badge>
              <Badge variant="teal">{order.orderStatus}</Badge>
            </div>
          </div>

          {/* Visual Progress Timeline */}
          <div className="py-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
              Real-time Order Timeline Progress
            </h3>

            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.key} className="flex md:flex-col items-center gap-3 relative z-10 flex-1">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                        isCurrent
                          ? 'bg-teal-500 text-white ring-4 ring-teal-500/20 scale-110'
                          : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>

                    <div className="text-left md:text-center">
                      <span className={`block text-xs font-bold ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                        {step.label}
                      </span>
                      <span className="text-[10px] text-slate-400 max-w-[120px] block leading-tight">
                        {step.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details & Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white pb-2 border-b flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-500" /> Delivery Address
            </h3>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">{order.shippingAddress?.name}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
              <p className="text-slate-400 pt-1">Phone: {order.shippingAddress?.phone}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white pb-2 border-b flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-500" /> Payment & Billing Summary
            </h3>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">₹{order.pricing?.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (5%):</span>
                <span className="font-semibold">₹{order.pricing?.tax?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Flatbed Transport:</span>
                <span className="font-semibold">₹{order.pricing?.deliveryFee?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-bold text-slate-900 dark:text-white text-sm">
                <span>Total Paid:</span>
                <span className="text-teal-600 dark:text-teal-400">₹{order.pricing?.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Vehicle Item Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Purchased Vehicles</h3>
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center gap-4">
                <img
                  src={item.image || item.vehicle?.images?.[0] || 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=300&q=80'}
                  alt={item.title}
                  className="w-20 h-16 object-cover rounded-xl"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h4>
                  <span className="text-xs text-slate-400">{item.brand} {item.model}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">₹{item.price?.toLocaleString()}</span>
                {order.orderStatus === 'DELIVERED' && (
                  <button
                    onClick={() => {
                      setSelectedVehicle(item.vehicle || item);
                      setShowReviewModal(true);
                    }}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-1"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    Review EV
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Submit Verified Buyer Review</h3>
              <p className="text-xs text-slate-500">Rate your experience driving your new electric vehicle</p>

              <div className="flex gap-2 justify-center py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star className={`w-8 h-8 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                  </button>
                ))}
              </div>

              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share performance, real range, charging speed, and delivery experience..."
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-2.5 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReviewSubmit}
                  disabled={submittingReview}
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-semibold shadow"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
