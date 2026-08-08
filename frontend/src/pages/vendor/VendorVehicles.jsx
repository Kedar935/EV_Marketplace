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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              My Vehicle Inventory
            </h1>
            <p className="text-xs text-slate-500 mt-1">Manage listings and view approval statuses</p>
          </div>

          <Link
            to="/vendor/add-vehicle"
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
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
          <div className="space-y-4">
            {vehicles.map((v) => (
              <div
                key={v._id}
                className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={v.images?.[0] || 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=300&q=80'}
                    alt={v.title}
                    className="w-24 h-16 object-cover rounded-xl shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{v.title}</h3>
                      <Badge
                        variant={
                          v.status === 'APPROVED'
                            ? 'success'
                            : v.status === 'PENDING_APPROVAL'
                            ? 'warning'
                            : v.status === 'REJECTED'
                            ? 'danger'
                            : 'neutral'
                        }
                      >
                        {v.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {v.brand} {v.model} • {v.rangeKm} km • ₹{(v.price / 100000).toFixed(2)} Lakh
                    </p>

                    {v.status === 'REJECTED' && v.rejectionReason && (
                      <p className="text-xs text-red-500 mt-1 font-medium">
                        Rejection Reason: {v.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {v.status === 'APPROVED' && (
                    <button
                      onClick={() => handleMarkSold(v._id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Mark Sold
                    </button>
                  )}
                  <Link
                    to={`/vehicles/${v._id}`}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(v._id)}
                    className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20"
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
