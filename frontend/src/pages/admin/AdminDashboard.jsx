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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Admin Control Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Platform overview, user metrics, and pending approvals</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/approvals"
              className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Pending Approvals ({metrics?.pendingListings || 0})</span>
            </Link>
          </div>
        </div>

        {/* System Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Total Revenue</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              ₹{(metrics?.totalRevenue / 100000 || 0).toFixed(2)} Lakh
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Customers</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {metrics?.totalUsers || 0}
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Vendors</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {metrics?.totalVendors || 0}
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">EVs Listed</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {metrics?.totalVehicles || 0}
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Total Orders</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {metrics?.totalOrders || 0}
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Pending Reviews</span>
            <div className="text-lg font-bold text-amber-500">
              {metrics?.pendingListings || 0}
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bar Chart: Top EV Brands */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">
              Top Listed EV Brands
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.topBrands}>
                  <XAxis dataKey="_id" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart: Body Segment Distribution */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">
              Body Type Share
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={charts.bodyTypesDist} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={70} label>
                    {charts.bodyTypesDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
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
