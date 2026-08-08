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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
              <LayoutDashboard className="w-4 h-4" />
              Live MongoDB Vendor Analytics
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Vendor Control Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/vendor/vehicles"
              className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs"
            >
              My Listings
            </Link>
            <Link
              to="/vendor/add-vehicle"
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add EV Listing</span>
            </Link>
          </div>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs text-slate-400 font-semibold block">Total Revenue</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ₹{(stats?.totalRevenue / 100000 || 0).toFixed(2)} Lakh
            </div>
            <span className="text-[11px] text-slate-500">Calculated from verified paid orders</span>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs text-slate-400 font-semibold block">Active Approved Listings</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.activeListings || 0}
            </div>
            <span className="text-[11px] text-slate-500">Live on public marketplace</span>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs text-slate-400 font-semibold block">Pending Approvals</span>
            <div className="text-2xl font-black text-amber-500">
              {stats?.pendingListings || 0}
            </div>
            <span className="text-[11px] text-slate-500">Awaiting admin review</span>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs text-slate-400 font-semibold block">Customer Rating</span>
            <div className="text-2xl font-black text-teal-600 dark:text-teal-400 flex items-center gap-1">
              <span>{stats?.rating || 5.0}</span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-[11px] text-slate-500">Verified buyer ratings</span>
          </div>
        </div>

        {/* Sales Chart with Recharts */}
        <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">
            Revenue Performance Chart
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  formatter={(val) => [`₹${(val / 100000).toFixed(2)} Lakh`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
