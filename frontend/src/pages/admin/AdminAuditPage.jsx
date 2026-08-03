import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';

export function AdminAuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/v1/admin/audit-logs').then((res) => {
      if (res.data?.success) setLogs(res.data.data.content || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-lg font-bold text-text-primary">System Audit Log</h1>
        <p className="text-xs text-text-tertiary mt-0.5">Immutable record of administrative and security actions.</p>
      </div>

      <div className="bg-surface border border-hairline rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-text-tertiary">Loading audit logs…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-text-tertiary uppercase tracking-wider text-[9px] font-semibold border-b border-hairline">
                <tr>
                  <th className="px-4 py-2.5">Timestamp</th>
                  <th className="px-4 py-2.5">Action</th>
                  <th className="px-4 py-2.5">Resource</th>
                  <th className="px-4 py-2.5">Actor</th>
                  <th className="px-4 py-2.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline font-mono text-[11px]">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-surface-2/50 transition-colors duration-100">
                    <td className="px-4 py-3 text-text-tertiary">{new Date(l.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-accent">{l.action}</td>
                    <td className="px-4 py-3 text-text-primary">{l.resource}</td>
                    <td className="px-4 py-3 text-text-tertiary">#{l.userId || 'System'}</td>
                    <td className="px-4 py-3 text-text-secondary">{l.description}</td>
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
