import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Link2, ShieldCheck, RefreshCw } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import api from '../../lib/axios';

export function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = () => {
    setLoading(true);
    api.get('/api/v1/admin/dashboard')
      .then((resMetrics) => {
        if (resMetrics?.data?.success) setMetrics(resMetrics.data.data);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-text-primary">Platform Analytics</h1>
          <p className="text-[11px] sm:text-xs text-text-tertiary mt-0.5">Live system click counts, user volume, and platform activity data.</p>
        </div>
        <Button onClick={fetchAnalytics} variant="secondary" size="sm" icon={RefreshCw} className="justify-center py-2 sm:py-1.5">
          Refresh Analytics
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        <StatCard title="Total Platform Users" value={loading ? "..." : (metrics?.totalUsers ?? 0)} icon={Users} />
        <StatCard title="Total Short URLs" value={loading ? "..." : (metrics?.totalUrls ?? 0)} icon={Link2} />
        <StatCard title="Global Clicks Recorded" value={loading ? "..." : (metrics?.totalClicks ?? 0)} icon={BarChart3} />
        <StatCard title="Threats Blocked" value={loading ? "..." : (metrics?.activeThreats ?? 0)} icon={ShieldCheck} />
      </div>

      <div className="bg-surface border border-hairline rounded-xl p-4 sm:p-5 space-y-4 shadow-sm w-full">
        <h3 className="text-[10px] font-bold text-text-primary uppercase tracking-wider">Live Telemetry Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          <div className="p-3 bg-canvas border border-hairline rounded-lg text-xs space-y-1">
            <span className="text-text-tertiary text-[10px] uppercase font-semibold">User Accounts</span>
            <p className="text-base sm:text-lg font-bold text-text-primary font-mono">{metrics?.totalUsers ?? 0}</p>
          </div>
          <div className="p-3 bg-canvas border border-hairline rounded-lg text-xs space-y-1">
            <span className="text-text-tertiary text-[10px] uppercase font-semibold">Active Short Links</span>
            <p className="text-base sm:text-lg font-bold text-accent font-mono">{metrics?.totalUrls ?? 0}</p>
          </div>
          <div className="p-3 bg-canvas border border-hairline rounded-lg text-xs space-y-1">
            <span className="text-text-tertiary text-[10px] uppercase font-semibold">Accumulated Clicks</span>
            <p className="text-base sm:text-lg font-bold text-emerald-400 font-mono">{metrics?.totalClicks ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalyticsPage;
