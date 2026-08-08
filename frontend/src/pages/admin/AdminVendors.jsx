import React, { useState, useEffect } from 'react';
import { Building2, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import API from '../../services/api';
import Badge from '../../components/Badge';
import { useToast } from '../../context/ToastContext';

const AdminVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/vendors');
      setVendors(res.data.vendors || []);
    } catch (e) {
      console.error('Fetch vendors error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleUpdateStatus = async (vendorId, status) => {
    try {
      await API.put(`/admin/vendors/${vendorId}/status`, { status });
      showSuccess(`Vendor status updated to ${status}`);
      fetchVendors();
    } catch (err) {
      showError(err.message || 'Failed to update vendor');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">
          Vendor & Dealership Management
        </h1>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4">Dealership</th>
                  <th className="p-4">Owner / Contact</th>
                  <th className="p-4">Total Sales</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {vendors.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-4 flex items-center gap-3">
                      <img src={v.logo} alt={v.businessName} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{v.businessName}</span>
                        <span className="text-slate-400">{v.contactEmail}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                      {v.user?.name} ({v.contactPhone})
                    </td>
                    <td className="p-4 font-bold text-teal-600 dark:text-teal-400">{v.totalSales || 0} EVs</td>
                    <td className="p-4 font-bold text-amber-500">{v.rating || 5.0} ★</td>
                    <td className="p-4">
                      <Badge variant={v.status === 'APPROVED' ? 'success' : v.status === 'PENDING_APPROVAL' ? 'warning' : 'danger'}>
                        {v.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      {v.status !== 'APPROVED' ? (
                        <button
                          onClick={() => handleUpdateStatus(v._id, 'APPROVED')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 font-bold text-xs"
                        >
                          Approve Vendor
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(v._id, 'SUSPENDED')}
                          className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold text-xs"
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVendors;
