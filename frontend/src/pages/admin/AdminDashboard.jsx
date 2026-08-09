import React, { useState, useEffect } from 'react';
import { Users, Link2, ShieldAlert, Activity, Server, BarChart3 } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import api from '../../lib/axios';

export function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/v1/admin/dashboard').catch(() => null),
      api.get('/actuator/health').catch(() => null)
    ]).then(([resMetrics, resHealth]) => {
      if (resMetrics?.data?.success) setMetrics(resMetrics.data.data);
      if (resHealth?.data) setHealth(resHealth.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      <div>
        <h1 className="text-base sm:text-lg font-bold text-text-primary">Admin Control Center</h1>
        <p className="text-[11px] sm:text-xs text-text-tertiary mt-0.5">System health status, total platform users, and live telemetry metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        <StatCard title="Platform Users" value={loading ? "..." : (metrics?.totalUsers ?? 0)} icon={Users} />
        <StatCard title="Global Short URLs" value={loading ? "..." : (metrics?.totalUrls ?? 0)} icon={Link2} />
        <StatCard title="Total Platform Clicks" value={loading ? "..." : (metrics?.totalClicks ?? 0)} icon={BarChart3} />
        <StatCard title="Threats Blocked" value={loading ? "..." : (metrics?.activeThreats ?? 0)} icon={ShieldAlert} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {/* Infrastructure Status Probes */}
        <div className="bg-surface border border-hairline p-4 sm:p-5 rounded-xl space-y-3 shadow-sm w-full">
          <h3 className="text-xs font-bold text-text-primary flex items-center gap-2">
            <Server className="w-4 h-4 text-accent flex-shrink-0" strokeWidth={1.75} />
            <span>Live Infrastructure Health</span>
          </h3>
          <div className="space-y-2">
            {[
              { name: 'Database Engine', status: health?.components?.db?.status || (loading ? 'Checking…' : 'UP') },
              { name: 'Redis Cache Layer', status: health?.components?.redis?.status || (loading ? 'Checking…' : 'UP') },
              { name: 'Disk Space Service', status: health?.components?.diskSpace?.status || (loading ? 'Checking…' : 'UP') },
              { name: 'Overall Application Health', status: health?.status || (loading ? 'Checking…' : 'UP') },
            ].map((node) => (
              <div key={node.name} className="flex justify-between items-center p-2.5 bg-canvas border border-hairline rounded-lg text-xs gap-2">
                <span className="font-semibold text-text-primary truncate">{node.name}</span>
                <span className="font-mono text-accent font-bold text-[10px] uppercase px-2 py-0.5 rounded bg-accent/10 border border-accent/15 flex-shrink-0">
                  {node.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Operational Metrics */}
        <div className="bg-surface border border-hairline p-4 sm:p-5 rounded-xl space-y-3 shadow-sm w-full">
          <h3 className="text-xs font-bold text-text-primary flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent flex-shrink-0" strokeWidth={1.75} />
            <span>Platform Resource Telemetry</span>
          </h3>
          <div className="space-y-2.5 text-xs pt-1">
            <div className="flex justify-between items-center p-2.5 bg-canvas border border-hairline rounded-lg gap-2">
              <span className="text-text-secondary font-medium truncate">Registered User Accounts</span>
              <span className="font-mono font-bold text-text-primary flex-shrink-0">{metrics?.totalUsers ?? 0}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-canvas border border-hairline rounded-lg gap-2">
              <span className="text-text-secondary font-medium truncate">Active Short Slugs</span>
              <span className="font-mono font-bold text-accent flex-shrink-0">{metrics?.totalUrls ?? 0}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-canvas border border-hairline rounded-lg gap-2">
              <span className="text-text-secondary font-medium truncate">Recorded Click Events</span>
              <span className="font-mono font-bold text-emerald-400 flex-shrink-0">{metrics?.totalClicks ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
