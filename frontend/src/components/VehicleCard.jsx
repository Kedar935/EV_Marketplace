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
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 dark:hover:border-teal-500/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80'}
          alt={vehicle.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Condition & Featured Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <Badge variant={vehicle.condition === 'NEW' ? 'teal' : 'neutral'}>
            {vehicle.condition}
          </Badge>
          {vehicle.isFeatured && <Badge variant="warning">Featured</Badge>}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(vehicle._id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 ${
            saved
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110'
              : 'bg-slate-900/40 text-white hover:bg-slate-900/70 hover:scale-110'
          }`}
          title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>

        {/* Range Badge Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-950/70 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
          <span>{vehicle.rangeKm} km range</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Model Year */}
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <span>{vehicle.brand} • {vehicle.year}</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{vehicle.location}</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/vehicles/${vehicle._id}`}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors line-clamp-1 mb-2">
              {vehicle.title}
            </h3>
          </Link>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 gap-2 my-3 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <BatteryCharging className="w-4 h-4 text-teal-500" />
              <span>{vehicle.batteryCapacityKwh} kWh Battery</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">{vehicle.bodyType}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-4">
            <RatingStars rating={vehicle.ratingsAverage} count={vehicle.ratingsQuantity} />
          </div>
        </div>

        {/* Price & Actions */}
        <div>
          <div className="flex items-baseline justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mb-4">
            <div>
              <span className="text-xs text-slate-400">Price</span>
              <div className="text-xl font-extrabold text-teal-600 dark:text-teal-400">
                {formattedPrice}
              </div>
            </div>

            {onCompare && (
              <button
                onClick={() => onCompare(vehicle._id)}
                className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1 transition-all ${
                  isComparing
                    ? 'bg-teal-500/10 text-teal-600 border-teal-500'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:border-slate-300'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                {isComparing ? 'Comparing' : 'Compare'}
              </button>
            )}
          </div>

          <Link
            to={`/vehicles/${vehicle._id}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-medium text-sm transition-all shadow-md group-hover:shadow-teal-500/20"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
