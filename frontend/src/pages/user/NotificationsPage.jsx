import React from 'react';
import { Bell, ShieldAlert, CheckCircle } from 'lucide-react';

export function NotificationsPage() {
  const notifications = [
    { id: 1, title: 'Security Alert', msg: 'Rate limit protection triggered 3 times in 24h.', time: '2 hours ago', icon: ShieldAlert, type: 'alert' },
    { id: 2, title: 'Link Expired', msg: 'Short code /promo-2026 reached expiration timestamp.', time: '1 day ago', icon: Bell, type: 'info' },
    { id: 3, title: 'Account Verified', msg: 'Enterprise telemetry key issued successfully.', time: '3 days ago', icon: CheckCircle, type: 'success' },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-lg font-bold text-text-primary">Notifications Center</h1>
        <p className="text-xs text-text-tertiary mt-0.5">System security alerts, link status notifications, and updates.</p>
      </div>

      <div className="bg-surface border border-hairline rounded-xl divide-y divide-hairline overflow-hidden">
        {notifications.map((n) => {
          const Icon = n.icon;
          const iconColors = {
            alert: 'bg-danger/10 text-danger border-danger/20',
            success: 'bg-accent/10 text-accent border-accent/20',
            info: 'bg-info/10 text-info border-info/20',
          };
          return (
            <div key={n.id} className="p-4 flex items-start gap-3 hover:bg-surface-2/50 transition-colors duration-100">
              <div className={`p-2 rounded-lg border text-xs ${iconColors[n.type]}`}>
                <Icon className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-text-primary">{n.title}</h3>
                  <span className="text-[10px] font-mono text-text-tertiary">{n.time}</span>
                </div>
                <p className="text-xs text-text-secondary">{n.msg}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NotificationsPage;
