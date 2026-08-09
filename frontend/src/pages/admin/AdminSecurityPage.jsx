import React, { useState, useEffect } from 'react';
import { ShieldAlert, Ban, RefreshCw, Search } from 'lucide-react';
import Button from '../../components/common/Button';
import api from '../../lib/axios';

export function AdminSecurityPage() {
  const [events, setEvents] = useState([]);
  const [blockedIps, setBlockedIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchSecurityData(); }, []);

  const fetchSecurityData = () => {
    setLoading(true);
    Promise.all([
      api.get('/api/v1/security/events').catch(() => null),
      api.get('/api/v1/security/blocked-ips').catch(() => null)
    ]).then(([eventsRes, ipsRes]) => {
      if (eventsRes?.data?.success) {
        const raw = eventsRes.data.data;
        setEvents(Array.isArray(raw) ? raw : (raw?.content || []));
      }
      if (ipsRes?.data?.success) {
        const raw = ipsRes.data.data;
        setBlockedIps(Array.isArray(raw) ? raw : (raw?.content || []));
      }
    }).finally(() => setLoading(false));
  };

  const filteredEvents = events.filter((e) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (e.eventType && e.eventType.toLowerCase().includes(q)) ||
      (e.ipAddress && e.ipAddress.toLowerCase().includes(q)) ||
      (e.description && e.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-text-primary">Threat & Security Center</h1>
          <p className="text-[11px] sm:text-xs text-text-tertiary mt-0.5">Monitor rate limit violations, security threats, and IP block rules.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64 min-w-0">
            <Search className="w-3.5 h-3.5 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search threat event or IP…"
              className="w-full pl-8 pr-3 py-2 sm:py-1.5 rounded-lg bg-surface-2 border border-hairline text-xs focus:outline-none focus:border-accent/40"
            />
          </div>
          <Button onClick={fetchSecurityData} variant="secondary" size="sm" icon={RefreshCw} className="justify-center py-2 sm:py-1.5">
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        <div className="bg-surface border border-hairline p-4 sm:p-5 rounded-xl space-y-3 shadow-sm w-full">
          <h3 className="text-xs font-bold text-text-primary flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" strokeWidth={1.75} />
            <span>Threat Log Events</span>
          </h3>
          {loading ? (
            <p className="text-xs text-text-tertiary">Loading threat log events…</p>
          ) : filteredEvents.length === 0 ? (
            <p className="text-xs text-text-tertiary">
              {search ? `No threat events matching "${search}"` : 'No security threat events recorded.'}
            </p>
          ) : (
            <div className="space-y-2">
              {filteredEvents.map((e) => (
                <div key={e.id} className="p-2.5 bg-canvas border border-hairline rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                  <div className="min-w-0">
                    <span className="font-mono font-bold text-rose-400 text-[11px]">{e.eventType}</span>
                    <p className="text-[10px] text-text-tertiary truncate">{e.description}</p>
                  </div>
                  <span className="font-mono text-text-tertiary text-[10px] sm:text-[11px] shrink-0">{e.ipAddress}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface border border-hairline p-4 sm:p-5 rounded-xl space-y-3 shadow-sm w-full">
          <h3 className="text-xs font-bold text-text-primary flex items-center gap-2">
            <Ban className="w-4 h-4 text-amber-400 flex-shrink-0" strokeWidth={1.75} />
            <span>Active Blocked IPs</span>
          </h3>
          {loading ? (
            <p className="text-xs text-text-tertiary">Loading blocked IP lists…</p>
          ) : blockedIps.length === 0 ? (
            <p className="text-xs text-text-tertiary">No IP addresses currently blocked.</p>
          ) : (
            <div className="space-y-2">
              {blockedIps.map((b) => (
                <div key={b.id} className="p-2.5 bg-canvas border border-hairline rounded-lg flex justify-between items-center text-xs gap-2">
                  <span className="font-mono font-bold text-amber-400 text-[11px] truncate">{b.ipAddress}</span>
                  <span className="text-text-tertiary text-[10px] shrink-0">{b.reason}</span>
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
