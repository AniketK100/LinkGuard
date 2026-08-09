import React, { useState, useEffect } from 'react';
import { Ban, CheckCircle2, AlertTriangle, RefreshCw, Search } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [banTarget, setBanTarget] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = () => {
    setLoading(true);
    setError('');
    api.get('/api/v1/admin/users')
      .then((res) => {
        if (res.data?.success) {
          const raw = res.data.data;
          const list = Array.isArray(raw) ? raw : (raw?.content || []);
          setUsers(list);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch registered users. Please ensure you are logged in with Admin credentials.');
      })
      .finally(() => setLoading(false));
  };

  const handleConfirmStatusChange = async () => {
    if (!banTarget) return;
    setUpdating(true);
    const newStatus = banTarget.status === 'BANNED' ? 'ACTIVE' : 'BANNED';
    try {
      await api.patch(`/api/v1/admin/users/${banTarget.id}/status`, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === banTarget.id ? { ...u, status: newStatus } : u))
      );
    } catch {
      alert('Failed to update user status');
    } finally {
      setUpdating(false);
      setBanTarget(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q)) ||
      String(u.id).includes(q)
    );
  });

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      {/* Header & Controls Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-text-primary">User Directory</h1>
          <p className="text-[11px] sm:text-xs text-text-tertiary mt-0.5">Inspect registered accounts, assign roles, and enforce moderation bans.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64 min-w-0">
            <Search className="w-3.5 h-3.5 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email…"
              className="w-full pl-8 pr-3 py-2 sm:py-1.5 rounded-lg bg-surface-2 border border-hairline text-xs focus:outline-none focus:border-accent/40"
            />
          </div>
          <Button onClick={fetchUsers} variant="secondary" size="sm" icon={RefreshCw} className="justify-center py-2 sm:py-1.5">
            Refresh
          </Button>
        </div>
      </div>

      {/* Responsive Table Card */}
      <div className="bg-surface border border-hairline rounded-xl overflow-hidden shadow-sm w-full">
        {loading ? (
          <div className="p-8 text-center text-xs text-text-tertiary">Loading registered users…</div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-danger space-y-2">
            <p>{error}</p>
            <Button onClick={fetchUsers} variant="secondary" size="sm">Retry</Button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-tertiary">
            {search ? `No user matching "${search}"` : 'No registered users found.'}
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs min-w-[680px]">
              <thead className="bg-surface-2 text-text-tertiary uppercase tracking-wider text-[9px] font-semibold border-b border-hairline">
                <tr>
                  <th className="px-3.5 py-2.5">ID</th>
                  <th className="px-3.5 py-2.5">Name</th>
                  <th className="px-3.5 py-2.5">Email</th>
                  <th className="px-3.5 py-2.5">Role</th>
                  <th className="px-3.5 py-2.5">Status</th>
                  <th className="px-3.5 py-2.5 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {filteredUsers.map((u) => {
                  const isSelf = u.email === currentUser?.email || u.id === currentUser?.id;
                  const isBanned = u.status === 'BANNED';
                  return (
                    <tr key={u.id} className="hover:bg-surface-2/50 transition-colors duration-100">
                      <td className="px-3.5 py-3 font-mono text-text-tertiary text-[11px]">#{u.id}</td>
                      <td className="px-3.5 py-3 font-bold text-text-primary">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span>{u.name}</span>
                          {isSelf && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-accent/15 text-accent border border-accent/20">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3.5 py-3 font-mono text-text-secondary text-[11px] break-all">{u.email}</td>
                      <td className="px-3.5 py-3">
                        <Badge variant={u.role === 'ADMIN' ? 'admin' : 'active'}>{u.role}</Badge>
                      </td>
                      <td className="px-3.5 py-3">
                        <Badge variant={isBanned ? 'disabled' : 'active'}>{u.status || 'ACTIVE'}</Badge>
                      </td>
                      <td className="px-3.5 py-3 text-right">
                        {isSelf ? (
                          <span className="text-[10px] text-text-tertiary font-mono italic">Self Account</span>
                        ) : (
                          <Button
                            onClick={() => setBanTarget(u)}
                            variant={isBanned ? 'secondary' : 'danger'}
                            size="sm"
                            icon={isBanned ? CheckCircle2 : Ban}
                            className="text-[11px] py-1 px-2.5"
                          >
                            {isBanned ? 'Unban' : 'Ban'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Themed Ban / Unban Confirmation Modal */}
      <Modal isOpen={!!banTarget} onClose={() => setBanTarget(null)} title={banTarget?.status === 'BANNED' ? 'Unban User Account' : 'Ban User Account'}>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${banTarget?.status === 'BANNED' ? 'bg-accent/10 border border-accent/20' : 'bg-danger/10 border border-danger/20'} flex-shrink-0`}>
              <AlertTriangle className={`w-5 h-5 ${banTarget?.status === 'BANNED' ? 'text-accent' : 'text-danger'}`} />
            </div>
            <div className="space-y-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-text-primary break-words">
                {banTarget?.status === 'BANNED' ? `Unban user ${banTarget?.name}?` : `Ban user ${banTarget?.name}?`}
              </p>
              <p className="text-[11px] sm:text-xs text-text-secondary">
                {banTarget?.status === 'BANNED'
                  ? 'This will restore full access to their dashboard and links.'
                  : 'This will suspend their access and disable all associated short URLs immediately.'}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 flex-wrap">
            <Button variant="secondary" size="sm" onClick={() => setBanTarget(null)}>Cancel</Button>
            <Button
              size="sm"
              onClick={handleConfirmStatusChange}
              disabled={updating}
              className={banTarget?.status === 'BANNED' ? 'bg-accent hover:bg-accent/90 text-white' : 'bg-danger hover:bg-danger/90 text-white border-danger'}
            >
              {updating ? 'Updating…' : banTarget?.status === 'BANNED' ? 'Confirm Unban' : 'Confirm Ban'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AdminUsersPage;
