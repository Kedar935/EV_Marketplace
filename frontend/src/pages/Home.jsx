import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  Shield,
  Search,
  Sparkles,
  ArrowRight,
  BatteryCharging,
  Gauge,
  SlidersHorizontal,
  ChevronRight,
  CheckCircle,
  Award,
} from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import { GridSkeleton } from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import API from '../services/api';

const Home = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get('/vehicles/featured');
      setFeaturedVehicles(res.data.vehicles || []);
    } catch (err) {
      setError(err.message || 'Failed to load featured electric vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/vehicles?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/vehicles');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-12 lg:py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <span className="inline-block px-3 py-1 rounded bg-slate-800 border border-slate-700 text-teal-400 text-xs font-medium">
                Electric Vehicle Marketplace
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Find Your Next Electric Vehicle
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Explore, compare and buy electric vehicles from marketplace sellers. Certified listings with range and battery verification.
              </p>

              {/* Hero Search Input */}
              <form onSubmit={handleSearchSubmit} className="max-w-lg mx-auto lg:mx-0 pt-2">
                <div className="flex items-center gap-2 p-1.5 bg-slate-800 border border-slate-700 rounded-lg">
                  <div className="flex items-center gap-2 px-2.5 w-full">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by brand, model or location..."
                      className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none py-1.5"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-md transition-colors shrink-0"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/vehicles"
                  className="px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs sm:text-sm transition-colors"
                >
                  Explore EVs
                </Link>
                <Link
                  to="/register?role=VENDOR"
                  className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs sm:text-sm transition-colors"
                >
                  Sell Your EV
                </Link>
              </div>
            </div>

            {/* Hero Image Card */}
            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-800/50">
                <img
                  src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80"
                  alt="Tesla Model 3"
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white block">Tesla Model 3</span>
                    <span className="text-slate-400 text-[11px]">Long Range Dual Motor</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-teal-400 text-sm block">₹45.00 Lakh</span>
                    <span className="text-slate-400 text-[11px]">629 km Range</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EV Body Type Categories */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Browse by Body Type
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Find an EV segment suited to your needs
            </p>
          </div>
          <Link
            to="/vehicles"
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'SUVs & Crossovers', bodyType: 'SUV', count: '12+ Models', img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=500&q=80' },
            { title: 'Sedans & Fastbacks', bodyType: 'Sedan', count: '8+ Models', img: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=500&q=80' },
            { title: 'Luxury & Performance', bodyType: 'Luxury', count: '6+ Models', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=500&q=80' },
            { title: 'City Hatchbacks', bodyType: 'Hatchback', count: '5+ Models', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80' },
          ].map((cat, idx) => (
            <Link
              key={idx}
              to={`/vehicles?bodyType=${cat.bodyType}`}
              className="group relative h-40 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 transition-all"
            >
              <img
                src={cat.img}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-semibold text-sm group-hover:text-teal-300 transition-colors">{cat.title}</h3>
                <span className="text-[11px] text-slate-300">{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Featured Electric Vehicles
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Verified inventory from marketplace sellers
              </p>
            </div>
            <Link
              to="/vehicles"
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-0.5"
            >
              <span>View All EVs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <GridSkeleton count={6} />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchFeatured} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                  onCompare={() => navigate(`/compare?add=${vehicle._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI Recommendation Banner */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block px-2.5 py-0.5 rounded bg-teal-950 border border-teal-800 text-teal-400 text-xs font-medium">
              Smart Vehicle Matcher
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Need help choosing the right EV?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Answer a few questions about your daily driving distance, budget, and seating requirements to find matched vehicles from our inventory.
            </p>
          </div>
          <Link
            to="/recommendations"
            className="px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-medium transition-colors shrink-0"
          >
            Launch AI Vehicle Finder
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
