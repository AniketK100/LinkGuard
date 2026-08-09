import React, { useState, useEffect } from 'react';
import { BarChart3, Globe, Smartphone, Monitor, Compass } from 'lucide-react';
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
        if (list.length > 0) setSelectedUrlId(list[0].id.toString());
      }
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedUrlId) return;
    setLoading(true);
    api.get(`/api/v1/analytics/${selectedUrlId}`)
      .then((res) => {
        if (res.data?.success) {
          setAnalytics(res.data.data);
        }
      })
      .catch(() => setAnalytics(null))
      .finally(() => setLoading(false));
  }, [selectedUrlId]);

  const BreakdownList = ({ title, icon: Icon, items }) => (
    <div className="bg-surface border border-hairline rounded-xl p-5 space-y-3">
      <h3 className="text-xs font-bold text-text-primary flex items-center gap-2">
        <Icon className="w-4 h-4 text-accent" strokeWidth={1.75} />
        <span>{title}</span>
      </h3>
      {!items || items.length === 0 ? (
        <p className="text-xs text-text-tertiary font-medium py-4 text-center">No telemetry records captured yet.</p>
      ) : (
        <div className="space-y-2.5">
          {items.map((item, idx) => {
            const count = item.count || 0;
            const pct = item.percentage != null ? item.percentage : 0;
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-medium text-text-secondary">{item.name || 'Unknown'}</span>
                  <span className="font-mono font-bold text-text-primary">
                    {count} <span className="text-text-tertiary font-normal">({pct}%)</span>
                  </span>
                </div>
                <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500 ease-out-expo"
                    style={{ width: `${Math.max(pct, 5)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-text-primary">Link Analytics</h1>
          <p className="text-xs text-text-tertiary mt-0.5">Track real-time click traffic, device breakdown, and browser statistics.</p>
        </div>
        {urls.length > 0 && (
          <div className="relative">
            <select
              value={selectedUrlId}
              onChange={(e) => setSelectedUrlId(e.target.value)}
              className="appearance-none px-4 pr-8 py-2 bg-surface border border-hairline rounded-lg text-xs font-mono font-semibold text-text-primary focus:outline-none focus:border-accent/40 transition-colors duration-100 cursor-pointer"
            >
              {urls.map((u) => (
                <option key={u.id} value={u.id} className="bg-surface text-text-primary">
                  /{u.shortCode} — {u.originalUrl.substring(0, 30)}…
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-3.5 h-3.5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-text-tertiary">Loading analytics telemetry…</div>
      ) : urls.length === 0 ? (
        <div className="p-12 text-center text-xs text-text-tertiary">No short links available. Create a short link to start tracking analytics.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StatCard title="Total Clicks" value={analytics?.totalClicks || 0} icon={BarChart3} />
            <StatCard title="Unique Visitors" value={analytics?.uniqueVisitors || 0} icon={Globe} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BreakdownList
              title="Device Distribution"
              icon={Smartphone}
              items={analytics?.byDevice}
            />
            <BreakdownList
              title="Browser Distribution"
              icon={Monitor}
              items={analytics?.byBrowser}
            />
            <BreakdownList
              title="Geographic Location"
              icon={Globe}
              items={analytics?.byCountry}
            />
            <BreakdownList
              title="Traffic Referrers"
              icon={Compass}
              items={analytics?.byReferrer}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsPage;
