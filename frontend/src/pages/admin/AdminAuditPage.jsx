import React, { useState, useEffect } from 'react';
import { History, RefreshCw, Search } from 'lucide-react';
import Button from '../../components/common/Button';
import api from '../../lib/axios';

export function AdminAuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchAuditLogs(); }, []);

  const fetchAuditLogs = () => {
    setLoading(true);
    api.get('/api/v1/audit/logs')
      .then((res) => {
        if (res.data?.success) {
          const raw = res.data.data;
          setLogs(Array.isArray(raw) ? raw : (raw?.content || []));
        }
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  };

  const filteredLogs = logs.filter((l) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (l.action && l.action.toLowerCase().includes(q)) ||
      (l.username && l.username.toLowerCase().includes(q)) ||
      (l.details && l.details.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-text-primary">System Audit Log</h1>
          <p className="text-[11px] sm:text-xs text-text-tertiary mt-0.5">Immutable record of admin actions, login attempts, and policy updates.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64 min-w-0">
            <Search className="w-3.5 h-3.5 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit action…"
              className="w-full pl-8 pr-3 py-2 sm:py-1.5 rounded-lg bg-surface-2 border border-hairline text-xs focus:outline-none focus:border-accent/40"
            />
          </div>
          <Button onClick={fetchAuditLogs} variant="secondary" size="sm" icon={RefreshCw} className="justify-center py-2 sm:py-1.5">
            Refresh Log
          </Button>
        </div>
      </div>

      <div className="bg-surface border border-hairline rounded-xl overflow-hidden shadow-sm w-full">
        {loading ? (
          <div className="p-8 text-center text-xs text-text-tertiary">Loading system audit trail…</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-tertiary">
            {search ? `No log matching "${search}"` : 'No administrative audit logs available yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs min-w-[680px]">
              <thead className="bg-surface-2 text-text-tertiary uppercase tracking-wider text-[9px] font-semibold border-b border-hairline">
                <tr>
                  <th className="px-3.5 py-2.5">ID</th>
                  <th className="px-3.5 py-2.5">User</th>
                  <th className="px-3.5 py-2.5">Action Event</th>
                  <th className="px-3.5 py-2.5">Details</th>
                  <th className="px-3.5 py-2.5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-surface-2/50 transition-colors duration-100">
                    <td className="px-3.5 py-3 font-mono text-text-tertiary text-[11px]">#{l.id}</td>
                    <td className="px-3.5 py-3 font-semibold text-text-primary text-[11px]">{l.username || 'System'}</td>
                    <td className="px-3.5 py-3 font-mono text-accent font-semibold text-[11px]">{l.action}</td>
                    <td className="px-3.5 py-3 text-text-secondary text-[11px] max-w-xs truncate">{l.details}</td>
                    <td className="px-3.5 py-3 text-right font-mono text-text-tertiary text-[10px]">
                      {l.timestamp ? new Date(l.timestamp).toLocaleString() : 'Now'}
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

export default AdminAuditPage;
