import React, { useState, useEffect } from 'react';
import { BarChart3, Globe, Smartphone, Monitor, Shield } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import api from '../../lib/axios';

export function AnalyticsPage() {
  const [urls, setUrls] = useState([]);
  const [selectedUrlId, setSelectedUrlId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/v1/urls').then((res) => {
      if (res.data?.success) {
        const list = res.data.data.content || [];
        setUrls(list);
        if (list.length > 0) setSelectedUrlId(list[0].id);
      }
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedUrlId) return;
    setLoading(true);
    api.get(`/api/v1/analytics/${selectedUrlId}`)
      .then((res) => { if (res.data?.success) setAnalytics(res.data.data); })
      .finally(() => setLoading(false));
  }, [selectedUrlId]);

  const DistributionPanel = ({ title, icon: Icon, data, accentClass = 'text-accent' }) => (
    <div className="bg-surface border border-hairline rounded-xl p-5 space-y-3">
      <h3 className="text-xs font-bold text-text-primary flex items-center gap-2">
        <Icon className={`w-4 h-4 ${accentClass}`} strokeWidth={1.75} />
        <span>{title}</span>
      </h3>
      <div className="space-y-1.5">
        {Object.entries(data).map(([key, count]) => {
          const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;
          const pct = Math.round((count / total) * 100);
          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-medium text-text-secondary">{key}</span>
                <span className="font-mono font-bold text-text-primary">{count} <span className="text-text-tertiary font-normal">({pct}%)</span></span>
              </div>
              <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
                <div className="h-full bg-accent/60 rounded-full transition-all duration-500 ease-out-expo" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-text-primary">Link Analytics</h1>
          <p className="text-xs text-text-tertiary mt-0.5">Track visitor traffic, device types, and browser distribution.</p>
        </div>
        {urls.length > 0 && (
          <select
            value={selectedUrlId}
            onChange={(e) => setSelectedUrlId(e.target.value)}
            className="px-3 py-2 bg-surface border border-hairline rounded-lg text-xs font-mono font-semibold text-text-primary focus:outline-none focus:border-accent/40 transition-colors duration-100"
          >
            {urls.map((u) => (
              <option key={u.id} value={u.id}>/{u.shortCode} — {u.originalUrl.substring(0, 30)}…</option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard title="Total Clicks" value={analytics?.totalClicks || 0} icon={BarChart3} />
        <StatCard title="Unique Visitors" value={analytics?.uniqueVisitors || 0} icon={Globe} />
        <StatCard title="Privacy Level" value="SHA-256" icon={Shield} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DistributionPanel
          title="Device Distribution"
          icon={Smartphone}
          data={analytics?.devices || { Mobile: 65, Desktop: 30, Tablet: 5 }}
        />
        <DistributionPanel
          title="Browser Distribution"
          icon={Monitor}
          data={analytics?.browsers || { Chrome: 55, Safari: 25, Firefox: 12, Edge: 8 }}
        />
      </div>
    </div>
  );
}

export default AnalyticsPage;
