import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, UserX, UserCheck } from 'lucide-react';
import API from '../../services/api';
import Badge from '../../components/Badge';
import { useToast } from '../../context/ToastContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/admin/users?search=${encodeURIComponent(search)}`);
      setUsers(res.data.users || []);
    } catch (e) {
      console.error('Fetch users error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await API.put(`/admin/users/${userId}/status`, { isActive: !currentStatus });
      showSuccess(`User account ${!currentStatus ? 'activated' : 'suspended'}`);
      fetchUsers();
    } catch (err) {
      showError(err.message || 'Failed to update user status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              User Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage accounts and role access controls</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user name or email..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-800 focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Phone</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">{u.name}</span>
                        <span className="text-slate-400 text-[11px]">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">{u.role}</td>
                    <td className="p-3.5 text-slate-500">{u.phone || 'N/A'}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        u.isActive ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleStatus(u._id, u.isActive)}
                          className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors ${
                            u.isActive
                              ? 'bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-100'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {u.isActive ? 'Suspend' : 'Activate'}
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

export default AdminUsers;
