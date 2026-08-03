import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';

export function AdminConfigPage() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/v1/admin/configurations').then((res) => {
      if (res.data?.success) setConfigs(res.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-lg font-bold text-text-primary">System Runtime Configurations</h1>
        <p className="text-xs text-text-tertiary mt-0.5">Global key-value configuration overrides.</p>
      </div>

      <div className="bg-surface border border-hairline rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-text-tertiary">Loading configurations…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-text-tertiary uppercase tracking-wider text-[9px] font-semibold border-b border-hairline">
                <tr>
                  <th className="px-4 py-2.5">Config Key</th>
                  <th className="px-4 py-2.5">Value</th>
                  <th className="px-4 py-2.5">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline font-mono text-[11px]">
                {configs.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-2/50 transition-colors duration-100">
                    <td className="px-4 py-3 font-bold text-accent">{c.configKey}</td>
                    <td className="px-4 py-3 text-text-primary">{c.configValue}</td>
                    <td className="px-4 py-3 text-text-secondary font-sans">{c.description}</td>
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

export default AdminConfigPage;
