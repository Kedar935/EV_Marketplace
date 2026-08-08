import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import { GridSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import API from '../services/api';

const ExploreVehicles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filtersMeta, setFiltersMeta] = useState({ brands: [], locations: [], bodyTypes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [naturalQuery, setNaturalQuery] = useState('');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [bodyType, setBodyType] = useState(searchParams.get('bodyType') || 'ALL');
  const [condition, setCondition] = useState(searchParams.get('condition') || 'ALL');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRange, setMinRange] = useState(searchParams.get('minRange') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Side-by-side comparison select tracker
  const [compareIds, setCompareIds] = useState([]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (brand) params.set('brand', brand);
      if (bodyType && bodyType !== 'ALL') params.set('bodyType', bodyType);
      if (condition && condition !== 'ALL') params.set('condition', condition);
      if (location) params.set('location', location);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (minRange) params.set('minRange', minRange);
      if (sort) params.set('sort', sort);
      params.set('page', page);
      params.set('limit', 9);

      setSearchParams(params);

      const res = await API.get(`/vehicles?${params.toString()}`);
      setVehicles(res.data.vehicles || []);
      setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
      setFiltersMeta(res.data.filtersMeta || { brands: [], locations: [], bodyTypes: [] });
    } catch (err) {
      setError(err.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [search, brand, bodyType, condition, location, minPrice, maxPrice, minRange, sort, page]);

  const handleNaturalQueryParse = async (e) => {
    e.preventDefault();
    if (!naturalQuery.trim()) return;

    try {
      const res = await API.post('/recommendations/parse-query', { text: naturalQuery });
      const parsed = res.data.parsedFilters;

      if (parsed.search) setSearch(parsed.search);
      if (parsed.maxPrice) setMaxPrice(parsed.maxPrice);
      if (parsed.minRange) setMinRange(parsed.minRange);
      if (parsed.bodyType) setBodyType(parsed.bodyType);
      setPage(1);
    } catch (err) {
      console.error('NLP parse error:', err);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setNaturalQuery('');
    setBrand('');
    setBodyType('ALL');
    setCondition('ALL');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setMinRange('');
    setSort('newest');
    setPage(1);
  };

  const handleToggleCompare = (id) => {
    if (compareIds.includes(id)) {
      setCompareIds((prev) => prev.filter((item) => item !== id));
    } else {
      if (compareIds.length >= 4) {
        alert('You can compare maximum 4 vehicles at a time.');
        return;
      }
      setCompareIds((prev) => [...prev, id]);
    }
  };

  const goToComparePage = () => {
    if (compareIds.length === 0) return;
    navigate(`/compare?ids=${compareIds.join(',')}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Electric Vehicle Marketplace
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover {pagination.total} long-range electric vehicles with verified specifications & battery warranties
          </p>
        </div>

        {/* Natural Language Query Bar */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-teal-950/80 via-slate-900 to-slate-950 border border-teal-500/30 text-white shadow-lg">
          <form onSubmit={handleNaturalQueryParse} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 text-teal-400 shrink-0">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Natural Language Search</span>
            </div>
            <input
              type="text"
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              placeholder="e.g. 'Show me SUVs under 30 Lakh with over 400km range'"
              className="w-full bg-slate-900/90 text-sm text-white placeholder-slate-400 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-400"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-all shrink-0"
            >
              Parse Query
            </button>
          </form>
        </div>

        {/* Floating Compare Drawer Bar */}
        {compareIds.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-bounce-short">
            <span className="text-xs font-semibold text-teal-400">
              {compareIds.length} Vehicles selected for comparison
            </span>
            <button
              onClick={goToComparePage}
              className="px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all"
            >
              Compare Now
            </button>
            <button
              onClick={() => setCompareIds([])}
              className="text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Multi-Faceted Filters Sidebar */}
          <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
                <SlidersHorizontal className="w-4 h-4 text-teal-500" />
                <span>Filter Vehicles</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Keyword Search Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Keyword Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Tesla, Nexon, Dual Motor..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Brand / Manufacturer
              </label>
              <select
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="">All Brands</option>
                {filtersMeta.brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Body Type Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Body Segment
              </label>
              <select
                value={bodyType}
                onChange={(e) => {
                  setBodyType(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="ALL">All Body Types</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury</option>
                <option value="Crossover">Crossover</option>
              </select>
            </div>

            {/* Price Max Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Max Price (₹ Lakh)
              </label>
              <input
                type="number"
                value={maxPrice ? maxPrice / 100000 : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setMaxPrice(val ? parseFloat(val) * 100000 : '');
                  setPage(1);
                }}
                placeholder="e.g. 50 (for 50 Lakh)"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>

            {/* Minimum Range Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Min Range (km)
              </label>
              <input
                type="number"
                value={minRange}
                onChange={(e) => {
                  setMinRange(e.target.value);
                  setPage(1);
                }}
                placeholder="e.g. 400"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>

            {/* Condition Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Condition
              </label>
              <div className="flex gap-2">
                {['ALL', 'NEW', 'USED'].map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => {
                      setCondition(cond);
                      setPage(1);
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      condition === cond
                        ? 'bg-teal-600 text-white shadow'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vehicle Grid & Sorting */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sort Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Showing {vehicles.length} of {pagination.total} Electric Vehicles
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 shrink-0">Sort By:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="newest">Newest Listed</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="range_desc">Highest Range (km)</option>
                  <option value="rating_desc">Highest Customer Rating</option>
                </select>
              </div>
            </div>

            {/* Vehicle Grid */}
            {loading ? (
              <GridSkeleton count={6} />
            ) : error ? (
              <ErrorState message={error} onRetry={fetchVehicles} />
            ) : vehicles.length === 0 ? (
              <EmptyState
                title="No vehicles found"
                description="Try broadening your price range, brand, or search filters."
                actionText="Reset All Filters"
                onAction={resetFilters}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle._id}
                    vehicle={vehicle}
                    onCompare={() => handleToggleCompare(vehicle._id)}
                    isComparing={compareIds.includes(vehicle._id)}
                  />
                ))}
              </div>
            )}

            {/* Pagination controls */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-3">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreVehicles;
