import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Scale,
  Zap,
  BatteryCharging,
  Clock,
  Gauge,
  Award,
  Trash2,
  PlusCircle,
  CheckCircle,
} from 'lucide-react';
import Badge from '../components/Badge';
import { GridSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import API from '../services/api';

const Comparison = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [highlights, setHighlights] = useState({});
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  const idsParam = searchParams.get('ids') || searchParams.get('add') || '';

  const fetchCatalog = async () => {
    try {
      const res = await API.get('/vehicles?limit=50');
      setCatalog(res.data.vehicles || []);
    } catch (e) {
      console.error('Fetch catalog error:', e);
    }
  };

  const fetchComparison = async (vehicleIds) => {
    if (!vehicleIds || vehicleIds.length === 0) {
      setVehicles([]);
      setHighlights({});
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/vehicles/compare', { vehicleIds });
      setVehicles(res.data.vehicles || []);
      setHighlights(res.data.highlights || {});
    } catch (err) {
      console.error('Comparison error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  useEffect(() => {
    const ids = idsParam ? idsParam.split(',').filter(Boolean) : [];
    fetchComparison(ids);
  }, [idsParam]);

  const removeVehicleFromCompare = (idToRemove) => {
    const currentIds = idsParam ? idsParam.split(',').filter(Boolean) : [];
    const nextIds = currentIds.filter((id) => id !== idToRemove);
    setSearchParams({ ids: nextIds.join(',') });
  };

  const addVehicleToCompare = (idToAdd) => {
    const currentIds = idsParam ? idsParam.split(',').filter(Boolean) : [];
    if (currentIds.length >= 4) return;
    if (!currentIds.includes(idToAdd)) {
      const nextIds = [...currentIds, idToAdd];
      setSearchParams({ ids: nextIds.join(',') });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Electric Vehicle Comparison
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Compare specifications, battery capacity, range, and pricing side-by-side
            </p>
          </div>

          {/* Quick Vehicle Selector */}
          {vehicles.length < 4 && (
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addVehicleToCompare(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-800 shadow-sm focus:outline-none"
              >
                <option value="">+ Add EV to compare...</option>
                {catalog
                  .filter((v) => !vehicles.some((item) => item._id === v._id))
                  .map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.brand} {v.title} ({v.rangeKm} km)
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <GridSkeleton count={3} />
        ) : vehicles.length === 0 ? (
          <EmptyState
            icon={Scale}
            title="No vehicles selected for comparison"
            description="Select up to 4 electric vehicles from our marketplace to compare pricing, battery range, charging speed, and features."
            actionText="Explore EVs"
            actionLink="/vehicles"
          />
        ) : (
          <div className="space-y-6">
            {/* Vehicle Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {vehicles.map((v) => {
                const isBestPrice = highlights.bestPrice === v._id;
                const isBestRange = highlights.bestRange === v._id;
                const isFastestCharge = highlights.fastestCharging === v._id;
                const isBestRated = highlights.bestRated === v._id;

                return (
                  <div
                    key={v._id}
                    className="relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-4 flex flex-col justify-between"
                  >
                    {/* Delete column */}
                    <button
                      onClick={() => removeVehicleFromCompare(v._id)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors z-10"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div>
                      {/* Image */}
                      <img
                        src={v.images?.[0] || 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80'}
                        alt={v.title}
                        className="w-full h-36 object-cover rounded-lg mb-3"
                      />

                      {/* Highlight Badges */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {isBestPrice && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-600 text-white">Best Price</span>}
                        {isBestRange && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-600 text-white">Best Range</span>}
                        {isFastestCharge && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-600 text-white">Fastest Charge</span>}
                        {isBestRated && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500 text-white">Best Rated</span>}
                      </div>

                      {/* Title & Brand */}
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">
                        {v.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mb-2">{v.brand} · {v.year}</p>

                      {/* Price */}
                      <div className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                        ₹{(v.price / 100000).toFixed(2)} Lakh
                      </div>

                      {/* Spec Stack */}
                      <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                        <div className="flex justify-between py-0.5">
                          <span className="text-slate-400">Claimed Range</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{v.rangeKm} km</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-slate-400">Battery Pack</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{v.batteryCapacityKwh} kWh</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-slate-400">Charging Time</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{v.chargingTimeHours} hrs</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-slate-400">Top Speed</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{v.topSpeedKmh} km/h</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-slate-400">Seating</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{v.seatingCapacity} Seats</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-slate-400">Rating</span>
                          <span className="font-semibold text-amber-500">{v.ratingsAverage} ★</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                      <Link
                        to={`/vehicles/${v._id}`}
                        className="w-full block text-center py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comparison;
