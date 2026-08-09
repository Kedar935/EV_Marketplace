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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
          Dealership Management
        </h1>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Dealership</th>
                  <th className="p-3.5">Owner / Contact</th>
                  <th className="p-3.5">Total Sales</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {vendors.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={v.logo} alt={v.businessName} className="w-8 h-8 rounded-md object-cover" />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">{v.businessName}</span>
                        <span className="text-slate-400 text-[11px]">{v.contactEmail}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">
                      {v.user?.name} ({v.contactPhone})
                    </td>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-white">{v.totalSales || 0} EVs</td>
                    <td className="p-3.5 font-bold text-amber-500">{v.rating || 5.0} ★</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        v.status === 'APPROVED' ? 'bg-emerald-600 text-white' : v.status === 'PENDING_APPROVAL' ? 'bg-amber-500 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {v.status !== 'APPROVED' ? (
                        <button
                          onClick={() => handleUpdateStatus(v._id, 'APPROVED')}
                          className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 font-medium text-xs transition-colors"
                        >
                          Approve Vendor
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(v._id, 'SUSPENDED')}
                          className="px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-100 font-medium text-xs transition-colors"
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
