import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import api from '../../lib/axios';

export function AdminAuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/v1/admin/audit-logs').then((res) => {
      if (res.data?.success) {
        setLogs(res.data.data.content || []);
      }
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Audit Log</h1>
        <p className="text-xs text-slate-400">Complete immutable record of all administrative and security actions.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading audit log...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3 font-semibold">Timestamp</th>
                  <th className="px-6 py-3 font-semibold">Action</th>
                  <th className="px-6 py-3 font-semibold">Resource</th>
                  <th className="px-6 py-3 font-semibold">User ID</th>
                  <th className="px-6 py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-slate-500">{new Date(l.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono font-semibold text-emerald-400">{l.action}</td>
                    <td className="px-6 py-4 text-slate-300">{l.resource}</td>
                    <td className="px-6 py-4 font-mono text-slate-400">#{l.userId || 'System'}</td>
                    <td className="px-6 py-4 text-slate-400">{l.description}</td>
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
