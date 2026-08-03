import React, { useState, useEffect } from 'react';
import { Users, Link2, BarChart3, ShieldAlert, CheckCircle2, Server } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import api from '../../lib/axios';

export function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/v1/admin/dashboard').then((res) => {
      if (res.data?.success) {
        setData(res.data.data);
      }
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Admin Overview</h1>
        <p className="text-xs text-slate-400">System-wide platform oversight, user management, and health telemetry.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 text-xs">Loading system overview...</div>
      ) : !data ? (
        <div className="p-8 text-center text-slate-500 text-xs">Failed to load admin data.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Platform Users" value={data.totalUsers} icon={Users} color="emerald" />
            <StatCard title="Total Short Links" value={data.totalUrls} icon={Link2} color="cyan" />
            <StatCard title="Total Traffic Clicks" value={data.totalClicks} icon={BarChart3} color="violet" />
            <StatCard title="Security Alerts" value={data.securityEventsCount} icon={ShieldAlert} color="rose" />
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>System Infrastructure Health</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Database Engine</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {data.systemHealth?.database}
                </span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Redis Cache Cluster</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {data.systemHealth?.redis}
                </span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Overall Platform Uptime</span>
                <span className="font-semibold text-emerald-400">
                  {data.systemHealth?.uptime}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
