import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Eye } from 'lucide-react';
import API from '../../services/api';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';
import { useToast } from '../../context/ToastContext';

const AdminApprovals = () => {
  const [pendingVehicles, setPendingVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/vehicles/pending');
      setPendingVehicles(res.data.pendingVehicles || []);
    } catch (e) {
      console.error('Fetch pending approvals error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const handleApprove = async (id) => {
    try {
      await API.put(`/admin/vehicles/${id}/approve`);
      showSuccess('Listing approved and published to live marketplace!');
      fetchPendingApprovals();
    } catch (err) {
      showError(err.message || 'Approval failed');
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicle || !rejectionReason.trim()) return;

    try {
      await API.put(`/admin/vehicles/${selectedVehicle._id}/reject`, {
        rejectionReason: rejectionReason.trim(),
      });
      showSuccess('Listing rejected and vendor notified.');
      setShowRejectModal(false);
      setRejectionReason('');
      fetchPendingApprovals();
    } catch (err) {
      showError(err.message || 'Rejection failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
          Approvals Queue
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Review vendor EV listing submissions before publishing to marketplace
        </p>

        {pendingVehicles.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No Pending Approvals"
            description="All vendor vehicle listing submissions have been reviewed."
          />
        ) : (
          <div className="space-y-3">
            {pendingVehicles.map((v) => (
              <div
                key={v._id}
                className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={v.images?.[0] || 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=300&q=80'}
                    alt={v.title}
                    className="w-24 h-16 object-cover rounded-lg shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-base text-slate-900 dark:text-white">{v.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Vendor: <strong className="text-slate-700 dark:text-slate-300">{v.vendor?.businessName}</strong> · {v.brand} {v.model} ({v.year})
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-slate-900 dark:text-white">₹{(v.price / 100000).toFixed(2)} Lakh</span>
                      <span>· {v.rangeKm} km Range</span>
                      <span>· {v.batteryCapacityKwh} kWh</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <button
                    onClick={() => handleApprove(v._id)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVehicle(v);
                      setShowRejectModal(true);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs flex items-center gap-1 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
            <form onSubmit={handleRejectSubmit} className="bg-white dark:bg-slate-900 rounded-xl p-5 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Reject Listing</h3>
              <p className="text-xs text-slate-500">Provide rejection reason so vendor can fix specs.</p>

              <textarea
                rows={4}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason: Price exceeds realistic MSRP or battery specification is incorrect..."
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 focus:outline-none"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-2 rounded-md border text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-md bg-red-600 text-white text-xs font-medium"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApprovals;
