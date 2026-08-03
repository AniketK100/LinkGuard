import React, { useState, useEffect } from 'react';
import { Link2 } from 'lucide-react';
import api from '../../lib/axios';

export function AdminUrlsPage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/v1/admin/urls').then((res) => {
      if (res.data?.success) {
        setUrls(res.data.data.content || []);
      }
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Global URL Moderation</h1>
        <p className="text-xs text-slate-400">System-wide inspection of all short URLs across all platform users.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading global links...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3 font-semibold">Short Link</th>
                  <th className="px-6 py-3 font-semibold">User ID</th>
                  <th className="px-6 py-3 font-semibold">Original Destination</th>
                  <th className="px-6 py-3 font-semibold">Clicks</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {urls.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-emerald-400">/{u.shortCode}</td>
                    <td className="px-6 py-4 font-mono text-slate-400">#{u.userId || 'Anon'}</td>
                    <td className="px-6 py-4 max-w-xs truncate text-slate-300">{u.originalUrl}</td>
                    <td className="px-6 py-4 font-semibold text-white">{u.clickCount}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {u.status}
                      </span>
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
