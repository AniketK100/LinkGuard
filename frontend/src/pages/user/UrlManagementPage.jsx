import React, { useState, useEffect } from 'react';
import { Search, Trash2, Power, Copy, Check, Lock } from 'lucide-react';
import Badge from '../../components/common/Badge';
import api from '../../lib/axios';

export function UrlManagementPage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => { fetchUrls(); }, []);

  const fetchUrls = () => {
    setLoading(true);
    api.get('/api/v1/urls')
      .then((res) => { if (res.data?.success) setUrls(res.data.data.content || []); })
      .finally(() => setLoading(false));
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const endpoint = currentStatus === 'ACTIVE' ? `/api/v1/urls/${id}/disable` : `/api/v1/urls/${id}/enable`;
    try { await api.patch(endpoint); fetchUrls(); } catch { alert('Failed to update status'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this short URL?')) return;
    try { await api.delete(`/api/v1/urls/${id}`); fetchUrls(); } catch { alert('Failed to delete URL'); }
  };

  const copyShortUrl = (shortCode, id) => {
    navigator.clipboard.writeText(window.location.origin + '/' + shortCode);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredUrls = urls.filter((u) =>
    u.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.originalUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-text-primary">Link Directory</h1>
          <p className="text-xs text-text-tertiary mt-0.5">Manage, filter, and inspect your active short links.</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-text-tertiary absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter links…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface border border-hairline rounded-lg text-xs text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent/40 transition-colors duration-100"
          />
        </div>
      </div>

      <div className="bg-surface border border-hairline rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-text-tertiary">Loading links…</div>
        ) : filteredUrls.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-tertiary">No short URLs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-text-tertiary uppercase tracking-wider text-[9px] font-semibold border-b border-hairline">
                <tr>
                  <th className="px-4 py-2.5">Slug</th>
                  <th className="px-4 py-2.5">Destination</th>
                  <th className="px-4 py-2.5">Clicks</th>
                  <th className="px-4 py-2.5">Security</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {filteredUrls.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-2/50 transition-colors duration-100">
                    <td className="px-4 py-3 font-mono font-semibold text-accent text-[11px]">/{u.shortCode}</td>
                    <td className="px-4 py-3 max-w-xs truncate text-text-secondary text-[11px]">{u.originalUrl}</td>
                    <td className="px-4 py-3 font-mono font-bold text-text-primary">{u.clickCount}</td>
                    <td className="px-4 py-3">
                      {u.isPasswordProtected ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-warning font-semibold font-mono bg-warning/10 px-2 py-0.5 rounded-md border border-warning/20">
                          <Lock className="w-3 h-3" /> LOCKED
                        </span>
                      ) : (
                        <span className="text-[10px] text-text-tertiary font-mono">OPEN</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={u.status === 'ACTIVE' ? 'active' : 'disabled'}>{u.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-0.5">
                        <button onClick={() => copyShortUrl(u.shortCode, u.id)} className="p-1.5 rounded-md text-text-tertiary hover:text-accent hover:bg-accent/5 transition-colors duration-100" title="Copy">
                          {copiedId === u.id ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => handleToggleStatus(u.id, u.status)} className="p-1.5 rounded-md text-text-tertiary hover:text-warning hover:bg-warning/5 transition-colors duration-100" title="Toggle">
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded-md text-text-tertiary hover:text-danger hover:bg-danger/5 transition-colors duration-100" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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

export default UrlManagementPage;
