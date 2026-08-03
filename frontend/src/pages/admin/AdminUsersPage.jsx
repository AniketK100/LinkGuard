import React, { useState, useEffect } from 'react';
import { Ban } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import api from '../../lib/axios';

export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = () => {
    setLoading(true);
    api.get('/api/v1/admin/users').then((res) => {
      if (res.data?.success) setUsers(res.data.data.content || []);
    }).finally(() => setLoading(false));
  };

  const handleBanUser = async (userId) => {
    if (!window.confirm(`Ban user #${userId}?`)) return;
    try {
      await api.patch(`/api/v1/admin/users/${userId}/status`, { status: 'BANNED' });
      fetchUsers();
    } catch {
      alert('Failed to update user status');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-lg font-bold text-text-primary">User Directory</h1>
        <p className="text-xs text-text-tertiary mt-0.5">Inspect registered accounts, assign roles, and enforce moderation bans.</p>
      </div>

      <div className="bg-surface border border-hairline rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-text-tertiary">Loading registered users…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-text-tertiary uppercase tracking-wider text-[9px] font-semibold border-b border-hairline">
                <tr>
                  <th className="px-4 py-2.5">User ID</th>
                  <th className="px-4 py-2.5">Name</th>
                  <th className="px-4 py-2.5">Email</th>
                  <th className="px-4 py-2.5">Role</th>
                  <th className="px-4 py-2.5 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-2/50 transition-colors duration-100">
                    <td className="px-4 py-3 font-mono text-text-tertiary">#{u.id}</td>
                    <td className="px-4 py-3 font-bold text-text-primary">{u.name}</td>
                    <td className="px-4 py-3 font-mono text-text-secondary">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={u.role === 'ADMIN' ? 'admin' : 'active'}>{u.role}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button onClick={() => handleBanUser(u.id)} variant="danger" size="sm" icon={Ban}>
                        Ban Account
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsersPage;
