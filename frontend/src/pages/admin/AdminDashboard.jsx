import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Building2,
  Car,
  Package,
  DollarSign,
  CheckSquare,
  TrendingUp,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import API from '../../services/api';
import Badge from '../../components/Badge';
import { GridSkeleton } from '../../components/SkeletonLoader';

const COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b'];

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [charts, setCharts] = useState({ topBrands: [], bodyTypesDist: [], salesOverTime: [] });
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/dashboard');
      setMetrics(res.data.metrics || {});
      setCharts(res.data.charts || { topBrands: [], bodyTypesDist: [], salesOverTime: [] });
      setPendingApprovals(res.data.pendingApprovals || []);
    } catch (e) {
      console.error('Fetch admin stats error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  if (loading) return <GridSkeleton count={4} />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold mb-2">
              <ShieldAlert className="w-4 h-4" />
              Platform Administrator Command Center
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Admin Marketplace Analytics
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/approvals"
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow flex items-center gap-1.5"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Pending Approvals ({metrics?.pendingListings || 0})</span>
            </Link>
          </div>
        </div>

        {/* System Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] text-slate-400 font-semibold block">Total Revenue</span>
            <div className="text-xl font-black text-emerald-500 mt-1">
              ₹{(metrics?.totalRevenue / 100000 || 0).toFixed(2)} Lakh
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] text-slate-400 font-semibold block">Total Customers</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {metrics?.totalUsers || 0}
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] text-slate-400 font-semibold block">Total Vendors</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {metrics?.totalVendors || 0}
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] text-slate-400 font-semibold block">Total EVs Listed</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {metrics?.totalVehicles || 0}
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] text-slate-400 font-semibold block">Total Orders</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {metrics?.totalOrders || 0}
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] text-slate-400 font-semibold block">Pending Listings</span>
            <div className="text-xl font-black text-amber-500 mt-1">
              {metrics?.pendingListings || 0}
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Bar Chart: Top EV Brands */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
              Top Listed EV Brands
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.topBrands}>
                  <XAxis dataKey="_id" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                  <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart: Body Segment Distribution */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
              Body Type Share
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={charts.bodyTypesDist} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label>
                    {charts.bodyTypesDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
