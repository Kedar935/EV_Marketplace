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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            My Order History
          </h1>
          <p className="text-xs text-slate-500 mt-1">Track delivery status and view invoices</p>
        </div>

        {loading ? (
          <GridSkeleton count={3} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders placed yet"
            description="You haven't placed any electric vehicle orders yet."
            actionText="Explore Marketplace"
            actionLink="/vehicles"
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-base text-slate-900 dark:text-white">{order.orderNumber}</span>
                    <Badge variant={order.paymentInfo?.status === 'PAID' ? 'success' : 'warning'}>
                      {order.paymentInfo?.status}
                    </Badge>
                    <Badge variant="teal">{order.orderStatus}</Badge>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span>{order.items?.length || 1} Vehicle(s)</span>
                  </div>

                  {/* Items brief preview */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {order.items?.map((it, idx) => (
                      <span key={idx} className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        {it.title || `${it.brand} ${it.model}`}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left md:text-right">
                    <span className="text-xs text-slate-400 block">Total Amount</span>
                    <span className="text-xl font-black text-teal-600 dark:text-teal-400">
                      ₹{order.pricing?.totalPrice?.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to={`/orders/${order._id}/track`}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <Truck className="w-4 h-4" />
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
