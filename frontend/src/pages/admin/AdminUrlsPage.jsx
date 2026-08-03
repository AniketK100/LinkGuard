import React, { useState, useEffect } from 'react';
import Badge from '../../components/common/Badge';
import api from '../../lib/axios';

export function AdminUrlsPage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/v1/admin/urls').then((res) => {
      if (res.data?.success) setUrls(res.data.data.content || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-lg font-bold text-text-primary">Global Link Moderation</h1>
        <p className="text-xs text-text-tertiary mt-0.5">System-wide inspection of all short links across all platform users.</p>
      </div>

      <div className="bg-surface border border-hairline rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-text-tertiary">Loading global URLs…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-text-tertiary uppercase tracking-wider text-[9px] font-semibold border-b border-hairline">
                <tr>
                  <th className="px-4 py-2.5">Short Slug</th>
                  <th className="px-4 py-2.5">Owner ID</th>
                  <th className="px-4 py-2.5">Destination</th>
                  <th className="px-4 py-2.5">Clicks</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {urls.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-2/50 transition-colors duration-100">
                    <td className="px-4 py-3 font-mono font-semibold text-accent text-[11px]">/{u.shortCode}</td>
                    <td className="px-4 py-3 font-mono text-text-tertiary">#{u.userId || 'Anon'}</td>
                    <td className="px-4 py-3 max-w-xs truncate text-text-secondary text-[11px]">{u.originalUrl}</td>
                    <td className="px-4 py-3 font-mono font-bold text-text-primary">{u.clickCount}</td>
                    <td className="px-4 py-3">
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
