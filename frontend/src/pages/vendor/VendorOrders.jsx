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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
          Order Fulfillment
        </h1>

        {orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders received yet"
            description="Orders placed for your vehicle listings will appear here."
          />
        ) : (
          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord._id}
                className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{ord.orderNumber}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Customer: {ord.customer?.name} ({ord.customer?.phone})</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Status:</span>
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                      className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
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
                  <span className="font-semibold block mb-0.5">Shipping Address:</span>
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
