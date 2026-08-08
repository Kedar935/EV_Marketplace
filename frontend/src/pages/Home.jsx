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
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-slate-950 text-white">
        {/* Glowing Background Accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                Next-Gen EV Discovery & Commerce
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
                Find Your Next <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">
                  Electric Drive
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Discover, compare, and buy certified electric vehicles from verified sellers with real-time battery analytics, transparent pricing, and instant home delivery.
              </p>

              {/* Hero Quick Search Input */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0 pt-2">
                <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-3 px-3 w-full">
                    <Search className="w-5 h-5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Tesla, Nexon EV, range 500+ km..."
                      className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none py-2"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-teal-500/25 shrink-0 flex items-center justify-center gap-2"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/vehicles"
                  className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition-all shadow-lg shadow-teal-500/25"
                >
                  Explore All EVs
                </Link>
                <Link
                  to="/register?role=VENDOR"
                  className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all"
                >
                  Sell Your EV
                </Link>
              </div>
            </div>

            {/* Hero Featured Vehicle Highlight Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-2 group">
                <img
                  src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80"
                  alt="Tesla Model 3"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent rounded-2xl" />

                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-teal-400">TESLA MODEL 3</span>
                    <span className="text-xs text-slate-400">Long Range Dual Motor</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-extrabold text-white">₹45.00 Lakh</span>
                    <span className="text-xs text-emerald-400 font-medium">629 km Range</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Browse by EV Segment
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select body style tailored for your driving lifestyle
            </p>
          </div>
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-1 text-sm font-bold text-teal-600 dark:text-teal-400 hover:gap-2 transition-all mt-3 sm:mt-0"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { title: 'SUVs & Crossovers', bodyType: 'SUV', count: '12+ Models', img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=500&q=80' },
            { title: 'Sedans & Fastbacks', bodyType: 'Sedan', count: '8+ Models', img: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=500&q=80' },
            { title: 'Luxury & Sports', bodyType: 'Luxury', count: '6+ Models', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=500&q=80' },
            { title: 'City Hatchbacks', bodyType: 'Hatchback', count: '5+ Models', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80' },
          ].map((cat, idx) => (
            <Link
              key={idx}
              to={`/vehicles?bodyType=${cat.bodyType}`}
              className="group relative h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={cat.img}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-bold text-base group-hover:text-teal-400 transition-colors">{cat.title}</h3>
                <span className="text-xs text-slate-300">{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured EVs Section */}
      <section className="py-16 bg-slate-100/50 dark:bg-slate-900/30 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold mb-2">
                <Award className="w-3.5 h-3.5" />
                Live MongoDB Inventory
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Featured Electric Vehicles
              </h2>
            </div>
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-1 text-sm font-bold text-teal-600 dark:text-teal-400 hover:gap-2 transition-all mt-3 sm:mt-0"
            >
              <span>Explore Marketplace</span>
              <ChevronRight className="w-4 h-4" />
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

      {/* AI Recommendation Teaser Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 border border-teal-500/30 p-8 sm:p-12 text-white shadow-2xl">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              Retrieval-Augmented AI Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Unsure which EV fits your daily commute?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Tell our AI your budget, daily driving distance, and seating needs. It instantly filters live database inventory and generates personalized recommendations.
            </p>
            <div className="pt-2">
              <Link
                to="/recommendations"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-sm shadow-xl shadow-teal-500/25 transition-all"
              >
                <span>Launch AI Vehicle Finder</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
