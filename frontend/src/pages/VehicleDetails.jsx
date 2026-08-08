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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-teal-500">Home</Link>
          <span>/</span>
          <Link to="/vehicles" className="hover:text-teal-500">Vehicles</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-semibold truncate">{vehicle.title}</span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
              <img
                src={vehicle.images?.[activeImage] || 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'}
                alt={vehicle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant={vehicle.condition === 'NEW' ? 'teal' : 'neutral'}>
                  {vehicle.condition}
                </Badge>
                {vehicle.stock < 1 && <Badge variant="danger">Sold Out</Badge>}
              </div>

              <button
                onClick={() => toggleWishlist(vehicle._id)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all z-10 ${
                  isSaved ? 'bg-red-500 text-white shadow-lg' : 'bg-slate-950/50 text-white hover:bg-slate-950/80'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Selector */}
            {vehicle.images && vehicle.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {vehicle.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImage === idx ? 'border-teal-500 shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Spec Summary & Purchase */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                <span>{vehicle.brand} • {vehicle.year}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {vehicle.location}</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2">
                {vehicle.title}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <RatingStars rating={vehicle.ratingsAverage} count={vehicle.ratingsQuantity} size="lg" />
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                  8-Year Battery Warranty Verified
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-6">
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider block mb-1">
                  Verified On-Road Price
                </span>
                <div className="text-3xl font-black text-teal-600 dark:text-teal-400">
                  ₹{priceInLakhs} Lakh
                </div>
                <span className="text-[11px] text-slate-500">Excludes local registration & insurance</span>
              </div>
            </div>

            {/* EV Spec Matrix Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <div className="p-2">
                <Zap className="w-5 h-5 text-teal-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Range</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{vehicle.rangeKm} km</span>
              </div>
              <div className="p-2 border-x border-slate-100 dark:border-slate-800">
                <BatteryCharging className="w-5 h-5 text-teal-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Battery</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{vehicle.batteryCapacityKwh} kWh</span>
              </div>
              <div className="p-2">
                <Clock className="w-5 h-5 text-teal-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Charge Time</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{vehicle.chargingTimeHours} hrs</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart(vehicle._id, 1)}
                  disabled={vehicle.stock < 1}
                  className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={vehicle.stock < 1}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 disabled:opacity-50"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => navigate(`/compare?add=${vehicle._id}`)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Scale className="w-4 h-4 text-teal-500" />
                <span>Add to Vehicle Comparison</span>
              </button>
            </div>

            {/* Verified Vendor Card */}
            {vehicle.vendor && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                <img
                  src={vehicle.vendor.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&q=80'}
                  alt={vehicle.vendor.businessName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{vehicle.vendor.businessName}</h4>
                    <ShieldCheck className="w-4 h-4 text-teal-500 fill-teal-500/20" />
                  </div>
                  <p className="text-xs text-slate-500">Certified EV Dealer • {vehicle.vendor.rating} ★ Rating</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features & Technical Specifications */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-16">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Vehicle Overview & Features
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {vehicle.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicle.features?.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Reviews Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Verified Customer Reviews
              </h3>
              <p className="text-xs text-slate-500">Only verified buyers who completed orders can review</p>
            </div>
            {reviewStats && (
              <div className="text-right">
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{reviewStats.average} / 5</div>
                <div className="text-xs text-slate-400">{reviewStats.total} Reviews</div>
              </div>
            )}
          </div>

          {reviews.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4">No reviews submitted for this vehicle yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-600 font-bold text-xs flex items-center justify-center">
                        {rev.user?.name?.[0] || 'U'}
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{rev.user?.name}</span>
                      <span className="text-[10px] bg-teal-500/10 text-teal-600 px-2 py-0.5 rounded-full font-medium">Verified Buyer</span>
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
    </div>
  );
};

export default VehicleDetails;
