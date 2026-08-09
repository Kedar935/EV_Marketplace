import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Zap,
  BatteryCharging,
  Gauge,
  Clock,
  Users,
  MapPin,
  Heart,
  ShoppingCart,
  ShieldCheck,
  Scale,
  Building2,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  Star,
} from 'lucide-react';
import RatingStars from '../components/RatingStars';
import Badge from '../components/Badge';
import { DetailSkeleton } from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { showSuccess } = useToast();

  const [vehicle, setVehicle] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicleDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get(`/vehicles/${id}`);
      setVehicle(res.data.vehicle);
      setRelated(res.data.related || []);

      // Fetch reviews
      try {
        const revRes = await API.get(`/reviews/vehicle/${id}`);
        setReviews(revRes.data.reviews || []);
        setReviewStats(revRes.data.stats || null);
      } catch (e) {
        console.error('Fetch reviews error:', e);
      }
    } catch (err) {
      setError(err.message || 'Failed to load vehicle details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleDetails();
  }, [id]);

  if (loading) return <DetailSkeleton />;
  if (error || !vehicle) return <ErrorState message={error || 'Vehicle not found'} onRetry={fetchVehicleDetails} />;

  const priceInLakhs = (vehicle.price / 100000).toFixed(2);
  const isSaved = isInWishlist(vehicle._id);

  const handleBuyNow = async () => {
    const success = await addToCart(vehicle._id, 1);
    if (success) {
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 pb-24 lg:pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-5">
          <Link to="/" className="hover:text-teal-600">Home</Link>
          <span>/</span>
          <Link to="/vehicles" className="hover:text-teal-600">Vehicles</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-medium truncate">{vehicle.title}</span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <img
                src={vehicle.images?.[activeImage] || 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'}
                alt={vehicle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-900/80 text-white">
                  {vehicle.condition}
                </span>
                {vehicle.stock < 1 && <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-600 text-white">Sold Out</span>}
              </div>

              <button
                onClick={() => toggleWishlist(vehicle._id)}
                className={`absolute top-3 right-3 p-2.5 rounded-full transition-all z-10 ${
                  isSaved ? 'bg-red-500 text-white shadow' : 'bg-slate-900/60 text-white hover:bg-slate-900'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {vehicle.images && vehicle.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {vehicle.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border shrink-0 transition-all ${
                      activeImage === idx ? 'border-teal-600 border-2' : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Spec Summary & CTAs */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>{vehicle.brand} · {vehicle.year}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {vehicle.location}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
                {vehicle.title}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <RatingStars rating={vehicle.ratingsAverage} count={vehicle.ratingsQuantity} />
                <span className="text-xs text-teal-700 dark:text-teal-400 font-medium bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-900">
                  Verified Specification
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  On-Road Price
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-teal-600 dark:text-teal-400">
                  ₹{priceInLakhs} Lakh
                </div>
              </div>
            </div>

            {/* Spec Grid */}
            <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="p-1.5">
                <Zap className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Range</span>
                <span className="text-xs font-semibold text-slate-900 dark:text-white">{vehicle.rangeKm} km</span>
              </div>
              <div className="p-1.5 border-x border-slate-100 dark:border-slate-800">
                <BatteryCharging className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Battery</span>
                <span className="text-xs font-semibold text-slate-900 dark:text-white">{vehicle.batteryCapacityKwh} kWh</span>
              </div>
              <div className="p-1.5">
                <Clock className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Charging</span>
                <span className="text-xs font-semibold text-slate-900 dark:text-white">{vehicle.chargingTimeHours} hrs</span>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:block space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => addToCart(vehicle._id, 1)}
                  disabled={vehicle.stock < 1}
                  className="py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={vehicle.stock < 1}
                  className="py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => navigate(`/compare?add=${vehicle._id}`)}
                className="w-full py-2 px-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <Scale className="w-3.5 h-3.5 text-teal-600" />
                <span>Compare Vehicle</span>
              </button>
            </div>

            {/* Vendor Details */}
            {vehicle.vendor && (
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <img
                  src={vehicle.vendor.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&q=80'}
                  alt={vehicle.vendor.businessName}
                  className="w-10 h-10 rounded-md object-cover border border-slate-200 dark:border-slate-700"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">{vehicle.vendor.businessName}</h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                  <p className="text-[11px] text-slate-500">Verified Marketplace Seller</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features & Description */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
            Vehicle Overview & Features
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
            {vehicle.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {vehicle.features?.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Reviews Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Customer Reviews
              </h3>
              <p className="text-xs text-slate-500">Verified buyer ratings and comments</p>
            </div>
            {reviewStats && (
              <div className="text-right">
                <div className="text-xl font-bold text-slate-900 dark:text-white">{reviewStats.average} / 5</div>
                <div className="text-xs text-slate-400">{reviewStats.total} Reviews</div>
              </div>
            )}
          </div>

          {reviews.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-2">No reviews submitted for this vehicle yet.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev._id} className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{rev.user?.name}</span>
                      <span className="text-[10px] bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded font-medium">Verified Buyer</span>
                    </div>
                    <RatingStars rating={rev.rating} showNumber={false} />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Purchase Bar for Mobile (Requirement #18) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 lg:hidden flex items-center justify-between gap-3 shadow-lg">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price</span>
          <span className="text-lg font-bold text-teal-600 dark:text-teal-400">₹{priceInLakhs} Lakh</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => addToCart(vehicle._id, 1)}
            disabled={vehicle.stock < 1}
            className="py-2 px-3 rounded-lg bg-slate-900 dark:bg-slate-800 text-white font-medium text-xs shrink-0"
          >
            Cart
          </button>
          <button
            onClick={handleBuyNow}
            disabled={vehicle.stock < 1}
            className="py-2 px-4 rounded-lg bg-teal-600 text-white font-medium text-xs shrink-0"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
