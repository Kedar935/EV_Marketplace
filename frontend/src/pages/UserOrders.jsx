import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, ArrowRight, Calendar, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { GridSkeleton } from '../components/SkeletonLoader';

const UserOrders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/orders/my-orders');
      setOrders(res.data.orders || []);
    } catch (e) {
      console.error('Fetch my orders error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchMyOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 flex items-center justify-center">
        <EmptyState
          icon={Package}
          title="Sign in to view your orders"
          description="Access your purchase history and live vehicle tracking timelines."
          actionText="Sign In"
          actionLink="/login"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            My Order History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Track delivery status and view order details</p>
        </div>

        {loading ? (
          <GridSkeleton count={3} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders placed yet"
            description="You haven't placed any electric vehicle orders yet."
            actionText="Explore EVs"
            actionLink="/vehicles"
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{order.orderNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      order.paymentInfo?.status === 'PAID' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {order.paymentInfo?.status}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-600 text-white">
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span>{order.items?.length || 1} Vehicle(s)</span>
                  </div>

                  {/* Items preview */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {order.items?.map((it, idx) => (
                      <span key={idx} className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {it.title || `${it.brand} ${it.model}`}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Amount</span>
                    <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
                      ₹{order.pricing?.totalPrice?.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to={`/orders/${order._id}/track`}
                    className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Order</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
