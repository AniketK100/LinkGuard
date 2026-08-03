import React, { useState, useEffect } from 'react';
import { ShieldAlert, Ban } from 'lucide-react';
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
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-lg font-bold text-text-primary">Threat & Security Center</h1>
        <p className="text-xs text-text-tertiary mt-0.5">Monitor rate limit violations, security threats, and IP block rules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface border border-hairline p-5 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-text-primary flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-danger" strokeWidth={1.75} />
            <span>Threat Events</span>
          </h3>
          {events.length === 0 ? (
            <p className="text-xs text-text-tertiary">No security threat events recorded.</p>
          ) : (
            <div className="space-y-2">
              {events.map((e) => (
                <div key={e.id} className="p-2.5 bg-canvas border border-hairline rounded-lg flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono font-bold text-danger">{e.eventType}</span>
                    <p className="text-[10px] text-text-tertiary">{e.description}</p>
                  </div>
                  <span className="font-mono text-text-tertiary text-[11px]">{e.ipAddress}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface border border-hairline p-5 rounded-xl space-y-3">
          <h3 className="text-xs font-bold text-text-primary flex items-center gap-2">
            <Ban className="w-4 h-4 text-warning" strokeWidth={1.75} />
            <span>Active Blocked IPs</span>
          </h3>
          {blockedIps.length === 0 ? (
            <p className="text-xs text-text-tertiary">No IP addresses currently blocked.</p>
          ) : (
            <div className="space-y-2">
              {blockedIps.map((b) => (
                <div key={b.id} className="p-2.5 bg-canvas border border-hairline rounded-lg flex justify-between items-center text-xs">
                  <span className="font-mono font-bold text-warning">{b.ipAddress}</span>
                  <span className="text-text-tertiary text-[10px]">{b.reason}</span>
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
