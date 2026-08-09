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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  // Active filter counter calculation
  const activeFilterCount = [
    brand !== '',
    bodyType !== 'ALL',
    condition !== 'ALL',
    location !== '',
    minPrice !== '',
    maxPrice !== '',
    minRange !== '',
  ].filter(Boolean).length;

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

  const renderFilterFields = () => (
    <div className="space-y-4">
      {/* Keyword Search Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Search
        </label>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Brand, model or location..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Brand
        </label>
        <select
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            setPage(1);
          }}
          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
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
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Body Type
        </label>
        <select
          value={bodyType}
          onChange={(e) => {
            setBodyType(e.target.value);
            setPage(1);
          }}
          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
        >
          <option value="ALL">All Body Types</option>
          <option value="SUV">SUV</option>
          <option value="Sedan">Sedan</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Luxury">Luxury</option>
          <option value="Crossover">Crossover</option>
        </select>
      </div>

      {/* Max Price Filter */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
          placeholder="e.g. 50"
          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
        />
      </div>

      {/* Minimum Range Filter */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
        />
      </div>

      {/* Condition Filter */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Condition
        </label>
        <div className="flex gap-1.5">
          {['ALL', 'NEW', 'USED'].map((cond) => (
            <button
              key={cond}
              type="button"
              onClick={() => {
                setCondition(cond);
                setPage(1);
              }}
              className={`flex-1 py-1 rounded text-xs font-medium transition-colors ${
                condition === cond
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Electric Vehicle Marketplace
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Explore {pagination.total} electric vehicle listings with verified specifications
            </p>
          </div>

          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
            <span>Filters ({activeFilterCount})</span>
          </button>
        </div>

        {/* Natural Language Search Input */}
        <div className="mb-6 p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-white">
          <form onSubmit={handleNaturalQueryParse} className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-1.5 text-teal-400 shrink-0">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-semibold">Natural Language Finder</span>
            </div>
            <input
              type="text"
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              placeholder="e.g. 'Show me SUVs under 30 Lakh with over 400km range'"
              className="w-full bg-slate-800 text-xs text-white placeholder-slate-400 border border-slate-700 rounded-md px-3 py-1.5 focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium rounded-md transition-colors shrink-0"
            >
              Apply Query
            </button>
          </form>
        </div>

        {/* Floating Compare Bar */}
        {compareIds.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 flex items-center gap-3">
            <span className="text-xs font-medium text-teal-400">
              {compareIds.length} EVs selected for comparison
            </span>
            <button
              onClick={goToComparePage}
              className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded transition-colors"
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block space-y-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm">
                <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
                <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset All
              </button>
            </div>

            {renderFilterFields()}
          </div>

          {/* Vehicle Grid & Sorting */}
          <div className="lg:col-span-3 space-y-5">
            {/* Sort Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Showing {vehicles.length} of {pagination.total} Vehicles
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 shrink-0">Sort By:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
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
                title="No EVs match your filters"
                description="Try resetting your price range, brand or body segment filters."
                actionText="Clear All Filters"
                onAction={resetFilters}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 px-2">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  className="p-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex justify-end">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 h-full p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Filters ({activeFilterCount})</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Close
                </button>
              </div>
              {renderFilterFields()}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2 rounded-md text-xs font-medium bg-teal-600 text-white"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreVehicles;
