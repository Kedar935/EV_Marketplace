import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Zap, BatteryCharging, MapPin, Scale, ArrowRight } from 'lucide-react';
import RatingStars from './RatingStars';
import Badge from './Badge';
import { useWishlist } from '../context/WishlistContext';

const VehicleCard = ({ vehicle, onCompare, isComparing = false }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const saved = isInWishlist(vehicle._id);

  const priceInLakhs = (vehicle.price / 100000).toFixed(2);
  const formattedPrice = `₹${priceInLakhs} Lakh`;

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow transition-all duration-200 flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80'}
          alt={vehicle.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 z-10">
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-900/80 text-white backdrop-blur-xs">
            {vehicle.condition}
          </span>
          {vehicle.isFeatured && (
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500 text-white">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(vehicle._id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all z-10 ${
            saved
              ? 'bg-red-500 text-white'
              : 'bg-slate-900/60 text-white hover:bg-slate-900'
          }`}
          title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
        </button>

        {/* Range Overlay */}
        <div className="absolute bottom-2.5 left-2.5 bg-slate-900/90 text-white text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
          <Zap className="w-3 h-3 text-teal-400 fill-teal-400" />
          <span>{vehicle.rangeKm} km range</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Location */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>{vehicle.brand} · {vehicle.year}</span>
            <div className="flex items-center gap-1 text-[11px]">
              <MapPin className="w-3 h-3" />
              <span>{vehicle.location}</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/vehicles/${vehicle._id}`}>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors line-clamp-1 mb-2">
              {vehicle.title}
            </h3>
          </Link>

          {/* Key Specs */}
          <div className="flex items-center justify-between py-2 px-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs text-slate-600 dark:text-slate-300 mb-3">
            <div className="flex items-center gap-1">
              <BatteryCharging className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{vehicle.batteryCapacityKwh} kWh</span>
            </div>
            <span className="font-medium text-slate-700 dark:text-slate-200">{vehicle.bodyType}</span>
          </div>

          {/* Rating */}
          <div className="mb-3">
            <RatingStars rating={vehicle.ratingsAverage} count={vehicle.ratingsQuantity} />
          </div>
        </div>

        {/* Price & Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Price</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {formattedPrice}
              </div>
            </div>

            {onCompare && (
              <button
                onClick={() => onCompare(vehicle._id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1 transition-colors ${
                  isComparing
                    ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:border-slate-300'
                }`}
              >
                <Scale className="w-3 h-3" />
                {isComparing ? 'Comparing' : 'Compare'}
              </button>
            )}
          </div>

          <Link
            to={`/vehicles/${vehicle._id}`}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
