import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  TrendingUp,
  DollarSign,
  Star,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import API from '../../services/api';
import Badge from '../../components/Badge';
import { GridSkeleton } from '../../components/SkeletonLoader';

const VendorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentListings, setRecentListings] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendorDashboard = async () => {
    try {
      setLoading(true);
      const res = await API.get('/vendor/dashboard');
      setStats(res.data.stats || {});
      setRecentListings(res.data.recentListings || []);
      setRecentOrders(res.data.recentOrders || []);
    } catch (e) {
      console.error('Fetch vendor dashboard error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorDashboard();
  }, []);

  if (loading) return <GridSkeleton count={4} />;

  // Sample data for sales analytics chart
  const salesData = [
    { month: 'Jan', sales: (stats?.totalRevenue || 4500000) * 0.15 },
    { month: 'Feb', sales: (stats?.totalRevenue || 4500000) * 0.25 },
    { month: 'Mar', sales: (stats?.totalRevenue || 4500000) * 0.40 },
    { month: 'Apr', sales: (stats?.totalRevenue || 4500000) * 0.65 },
    { month: 'May', sales: (stats?.totalRevenue || 4500000) * 0.85 },
    { month: 'Jun', sales: stats?.totalRevenue || 4500000 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Vendor Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Overview of your EV listings, sales, and order management</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/vendor/vehicles"
              className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors"
            >
              My Listings
            </Link>
            <Link
              to="/vendor/add-vehicle"
              className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add EV Listing</span>
            </Link>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Total Revenue</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              ₹{(stats?.totalRevenue / 100000 || 0).toFixed(2)} Lakh
            </div>
            <span className="text-[11px] text-slate-400 block pt-0.5">From completed customer orders</span>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Active Listings</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats?.activeListings || 0}
            </div>
            <span className="text-[11px] text-slate-400 block pt-0.5">Approved & live on marketplace</span>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Pending Review</span>
            <div className="text-2xl font-bold text-amber-500">
              {stats?.pendingListings || 0}
            </div>
            <span className="text-[11px] text-slate-400 block pt-0.5">Awaiting admin approval</span>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Vendor Rating</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <span>{stats?.rating || 5.0}</span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-[11px] text-slate-400 block pt-0.5">Verified customer reviews</span>
          </div>
        </div>

        {/* Revenue Performance Chart */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
            Revenue Performance
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(val) => [`₹${(val / 100000).toFixed(2)} Lakh`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
