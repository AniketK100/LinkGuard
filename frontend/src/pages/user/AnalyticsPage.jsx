import React, { useState, useEffect } from 'react';
import { BarChart3, Globe, Smartphone, Monitor, Download } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import api from '../../lib/axios';

export function AnalyticsPage() {
  const [urls, setUrls] = useState([]);
  const [selectedUrlId, setSelectedUrlId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/api/v1/urls').then((res) => {
      if (res.data?.success && res.data.data.content?.length > 0) {
        setUrls(res.data.data.content);
        setSelectedUrlId(res.data.data.content[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedUrlId) return;
    setLoading(true);
    api.get(`/api/v1/analytics/${selectedUrlId}`).then((res) => {
      if (res.data?.success) {
        setAnalytics(res.data.data);
      }
    }).finally(() => setLoading(false));
  }, [selectedUrlId]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Traffic & Analytics Telemetry</h1>
          <p className="text-xs text-slate-400">Real-time click distribution, devices, browsers, and country reports.</p>
        </div>

        {urls.length > 0 && (
          <select
            value={selectedUrlId}
            onChange={(e) => setSelectedUrlId(e.target.value)}
            className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
          >
            {urls.map((u) => (
              <option key={u.id} value={u.id}>
                /{u.shortCode} - {u.title || u.originalUrl}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs">Loading analytics data...</div>
      ) : !analytics ? (
        <div className="p-12 text-center text-slate-500 text-xs">Select a URL to view analytics telemetry.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard title="Total Clicks" value={analytics.totalClicks} icon={BarChart3} color="emerald" />
            <StatCard title="Unique Visitors" value={analytics.uniqueVisitors} icon={Globe} color="cyan" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Country Breakdown */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Geographic Countries</span>
              </h3>
              <div className="space-y-3">
                {analytics.byCountry?.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-300">{item.name}</span>
                      <span className="text-emerald-400">{item.count} ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>Device Breakdown</span>
              </h3>
              <div className="space-y-3">
                {analytics.byDevice?.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-300 capitalize">{item.name}</span>
                      <span className="text-cyan-400">{item.count} ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${item.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsPage;
