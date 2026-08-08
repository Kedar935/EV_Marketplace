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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold mb-2">
              <Scale className="w-4 h-4" />
              Side-by-Side EV Matrix
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Electric Vehicle Comparison
            </h1>
            <p className="text-xs text-slate-500">Compare specifications, range, and value highlights side-by-side</p>
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
                className="px-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <option value="">+ Add Vehicle to Compare...</option>
                {catalog
                  .filter((v) => !vehicles.some((item) => item._id === v._id))
                  .map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.brand} {v.model} ({v.rangeKm}km)
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
            actionText="Browse Marketplace"
            actionLink="/vehicles"
          />
        ) : (
          <div className="space-y-6">
            {/* Visual Vehicle Comparison Table Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {vehicles.map((v) => {
                const isBestPrice = highlights.bestPrice === v._id;
                const isBestRange = highlights.bestRange === v._id;
                const isFastestCharge = highlights.fastestCharging === v._id;
                const isBestRated = highlights.bestRated === v._id;
                const isBestValue = highlights.bestOverallValue === v._id;

                return (
                  <div
                    key={v._id}
                    className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-5 flex flex-col justify-between"
                  >
                    {/* Delete comparison column */}
                    <button
                      onClick={() => removeVehicleFromCompare(v._id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors z-10"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div>
                      {/* Image */}
                      <img
                        src={v.images?.[0] || 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80'}
                        alt={v.title}
                        className="w-full h-40 object-cover rounded-2xl mb-4"
                      />

                      {/* Automated Highlight Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {isBestPrice && <Badge variant="success">Best Price</Badge>}
                        {isBestRange && <Badge variant="teal">Best Range</Badge>}
                        {isFastestCharge && <Badge variant="info">Fastest Charge</Badge>}
                        {isBestRated && <Badge variant="warning">Best Rated</Badge>}
                        {isBestValue && <Badge variant="teal">Best Overall Value</Badge>}
                      </div>

                      {/* Title & Brand */}
                      <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                        {v.brand} {v.model}
                      </h3>
                      <p className="text-xs text-slate-400 mb-3">{v.year} • {v.bodyType}</p>

                      {/* Price */}
                      <div className="text-xl font-black text-teal-600 dark:text-teal-400 mb-4">
                        ₹{(v.price / 100000).toFixed(2)} Lakh
                      </div>

                      {/* Specs Stack */}
                      <div className="space-y-2.5 text-xs border-t border-slate-100 dark:border-slate-800 pt-4">
                        <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
                          <span className="text-slate-400">Claimed Range</span>
                          <span className="font-bold text-slate-900 dark:text-white">{v.rangeKm} km</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
                          <span className="text-slate-400">Battery Pack</span>
                          <span className="font-bold text-slate-900 dark:text-white">{v.batteryCapacityKwh} kWh</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
                          <span className="text-slate-400">Charging Time</span>
                          <span className="font-bold text-slate-900 dark:text-white">{v.chargingTimeHours} hrs</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
                          <span className="text-slate-400">Top Speed</span>
                          <span className="font-bold text-slate-900 dark:text-white">{v.topSpeedKmh} km/h</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
                          <span className="text-slate-400">Seating</span>
                          <span className="font-bold text-slate-900 dark:text-white">{v.seatingCapacity} Seats</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-400">User Rating</span>
                          <span className="font-bold text-amber-500">{v.ratingsAverage} ★</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                      <Link
                        to={`/vehicles/${v._id}`}
                        className="w-full block text-center py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 text-white font-bold text-xs shadow"
                      >
                        View Full Specs
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
