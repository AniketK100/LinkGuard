import React, { useState, useEffect } from 'react';
import { Wrench } from 'lucide-react';
import api from '../../lib/axios';

export function AdminConfigPage() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = () => {
    setLoading(true);
    api.get('/api/v1/admin/configurations').then((res) => {
      if (res.data?.success) {
        setConfigs(res.data.data || []);
      }
    }).finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Settings & Configurations</h1>
        <p className="text-xs text-slate-400">Global system runtime key-value configuration overrides.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading configurations...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3 font-semibold">Config Key</th>
                  <th className="px-6 py-3 font-semibold">Config Value</th>
                  <th className="px-6 py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {configs.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-emerald-400">{c.configKey}</td>
                    <td className="px-6 py-4 font-mono text-white">{c.configValue}</td>
                    <td className="px-6 py-4 text-slate-400">{c.description}</td>
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
