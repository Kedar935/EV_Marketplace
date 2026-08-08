import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2 } from 'lucide-react';
import API from '../../services/api';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';
import { useToast } from '../../context/ToastContext';

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  const fetchVendorOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/vendor/orders');
      setOrders(res.data.orders || []);
    } catch (e) {
      console.error('Fetch vendor orders error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, {
        status: newStatus,
        description: `Vendor updated fulfillment status to ${newStatus}`,
      });
      showSuccess(`Order status updated to ${newStatus}`);
      fetchVendorOrders();
    } catch (err) {
      showError(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">
          Vendor Order Fulfillment
        </h1>

        {orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders received yet"
            description="Orders placed for your vehicle listings will appear here."
          />
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord._id}
                className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="font-extrabold text-base text-slate-900 dark:text-white">{ord.orderNumber}</span>
                    <p className="text-xs text-slate-400">Customer: {ord.customer?.name} ({ord.customer?.phone})</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Update Status:</span>
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                      className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold block mb-1">Shipping Address:</span>
                  <p>{ord.shippingAddress?.street}, {ord.shippingAddress?.city}, {ord.shippingAddress?.pincode}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOrders;
