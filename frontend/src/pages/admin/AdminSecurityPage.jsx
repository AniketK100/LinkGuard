import React, { useState, useEffect } from 'react';
import { ShieldAlert, Lock, Ban } from 'lucide-react';
import api from '../../lib/axios';

export function AdminSecurityPage() {
  const [events, setEvents] = useState([]);
  const [blockedIps, setBlockedIps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/v1/security/events'),
      api.get('/api/v1/security/blocked-ips')
    ]).then(([eventsRes, ipsRes]) => {
      if (eventsRes.data?.success) setEvents(eventsRes.data.data.content || []);
      if (ipsRes.data?.success) setBlockedIps(ipsRes.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Security & Threat Center</h1>
        <p className="text-xs text-slate-400">Monitor rate limiting violations, suspicious activity, and blocked IP rules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Events */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Recent Threat Events</span>
          </h3>
          {events.length === 0 ? (
            <p className="text-xs text-slate-500">No security threat events recorded.</p>
          ) : (
            <div className="space-y-2">
              {events.map((e) => (
                <div key={e.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-rose-400">{e.eventType}</span>
                    <p className="text-[10px] text-slate-400">{e.description}</p>
                  </div>
                  <span className="font-mono text-slate-500">{e.ipAddress}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Blocked IPs */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Ban className="w-4 h-4 text-amber-400" />
            <span>Active Blocked IPs</span>
          </h3>
          {blockedIps.length === 0 ? (
            <p className="text-xs text-slate-500">No IP addresses currently blocked.</p>
          ) : (
            <div className="space-y-2">
              {blockedIps.map((b) => (
                <div key={b.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs flex justify-between items-center">
                  <span className="font-mono text-amber-400 font-semibold">{b.ipAddress}</span>
                  <span className="text-slate-400 text-[10px]">{b.reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminSecurityPage;
