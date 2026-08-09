import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Trash2, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import API from '../../services/api';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';
import { useToast } from '../../context/ToastContext';

const VendorVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  const fetchVendorVehicles = async () => {
    try {
      setLoading(true);
      const res = await API.get('/vendor/vehicles');
      setVehicles(res.data.vehicles || []);
    } catch (e) {
      console.error('Fetch vendor vehicles error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorVehicles();
  }, []);

  const handleMarkSold = async (id) => {
    try {
      await API.put(`/vendor/vehicles/${id}/mark-sold`);
      showSuccess('Vehicle marked as SOLD');
      fetchVendorVehicles();
    } catch (err) {
      showError(err.message || 'Failed to update vehicle');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await API.delete(`/vendor/vehicles/${id}`);
      showSuccess('Listing deleted');
      fetchVendorVehicles();
    } catch (err) {
      showError(err.message || 'Failed to delete vehicle');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              My EV Inventory
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage listings and view approval statuses</p>
          </div>

          <Link
            to="/vendor/add-vehicle"
            className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add EV Listing</span>
          </Link>
        </div>

        {vehicles.length === 0 ? (
          <EmptyState
            title="No vehicles in inventory"
            description="Add your first electric vehicle listing to start selling."
            actionText="Add EV Listing"
            actionLink="/vendor/add-vehicle"
          />
        ) : (
          <div className="space-y-3">
            {vehicles.map((v) => (
              <div
                key={v._id}
                className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={v.images?.[0] || 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=300&q=80'}
                    alt={v.title}
                    className="w-20 h-14 object-cover rounded-lg shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{v.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        v.status === 'APPROVED'
                          ? 'bg-emerald-600 text-white'
                          : v.status === 'PENDING_APPROVAL'
                          ? 'bg-amber-500 text-white'
                          : v.status === 'REJECTED'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-600 text-white'
                      }`}>
                        {v.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {v.brand} {v.model} · {v.rangeKm} km · ₹{(v.price / 100000).toFixed(2)} Lakh
                    </p>

                    {v.status === 'REJECTED' && v.rejectionReason && (
                      <p className="text-xs text-red-500 mt-0.5 font-medium">
                        Rejection Reason: {v.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {v.status === 'APPROVED' && (
                    <button
                      onClick={() => handleMarkSold(v._id)}
                      className="px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      Mark Sold
                    </button>
                  )}
                  <Link
                    to={`/vehicles/${v._id}`}
                    className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(v._id)}
                    className="p-1.5 rounded-md bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorVehicles;
