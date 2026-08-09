import React, { useState, useEffect } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import api from '../../lib/axios';

export function AdminUrlsPage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUrls(); }, []);

  const fetchUrls = () => {
    setLoading(true);
    setError('');
    api.get('/api/v1/admin/urls')
      .then((res) => {
        if (res.data?.success) {
          const raw = res.data.data;
          const list = Array.isArray(raw) ? raw : (raw?.content || []);
          setUrls(list);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch global URLs. Please check admin permissions.');
      })
      .finally(() => setLoading(false));
  };

  const filteredUrls = urls.filter((u) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (u.shortCode && u.shortCode.toLowerCase().includes(q)) ||
      (u.originalUrl && u.originalUrl.toLowerCase().includes(q)) ||
      (u.status && u.status.toLowerCase().includes(q)) ||
      String(u.userId || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-text-primary">Global Link Moderation</h1>
          <p className="text-[11px] sm:text-xs text-text-tertiary mt-0.5">System-wide inspection of all short links across all platform users.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64 min-w-0">
            <Search className="w-3.5 h-3.5 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search slug, domain or destination…"
              className="w-full pl-8 pr-3 py-2 sm:py-1.5 rounded-lg bg-surface-2 border border-hairline text-xs focus:outline-none focus:border-accent/40"
            />
          </div>
          <Button onClick={fetchUrls} variant="secondary" size="sm" icon={RefreshCw} className="justify-center py-2 sm:py-1.5">
            Refresh
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-surface border border-hairline rounded-xl overflow-hidden shadow-sm w-full">
        {loading ? (
          <div className="p-8 text-center text-xs text-text-tertiary">Loading global URLs…</div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-danger space-y-2">
            <p>{error}</p>
            <Button onClick={fetchUrls} variant="secondary" size="sm">Retry</Button>
          </div>
        ) : filteredUrls.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-tertiary">
            {search ? `No URL matching "${search}"` : 'No short links exist in the system yet. Create short URLs to view global moderation logs.'}
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs min-w-[680px]">
              <thead className="bg-surface-2 text-text-tertiary uppercase tracking-wider text-[9px] font-semibold border-b border-hairline">
                <tr>
                  <th className="px-3.5 py-2.5">Short Slug</th>
                  <th className="px-3.5 py-2.5">Owner ID</th>
                  <th className="px-3.5 py-2.5">Destination URL</th>
                  <th className="px-3.5 py-2.5">Clicks</th>
                  <th className="px-3.5 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {filteredUrls.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-2/50 transition-colors duration-100">
                    <td className="px-3.5 py-3 font-mono font-semibold text-accent text-[11px]">/{u.shortCode}</td>
                    <td className="px-3.5 py-3 font-mono text-text-tertiary text-[11px]">#{u.userId || 'Anon'}</td>
                    <td className="px-3.5 py-3 max-w-xs sm:max-w-md truncate text-text-secondary text-[11px] font-mono">{u.originalUrl}</td>
                    <td className="px-3.5 py-3 font-mono font-bold text-text-primary text-[11px]">{u.clickCount}</td>
                    <td className="px-3.5 py-3">
                      <Badge variant={u.status === 'ACTIVE' ? 'active' : 'disabled'}>{u.status}</Badge>
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

export default AdminUrlsPage;
