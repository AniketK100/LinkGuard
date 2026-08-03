import React from 'react';
import { Bell, Info } from 'lucide-react';

export function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Notifications</h1>
        <p className="text-xs text-slate-400">Updates regarding your account, system maintenance, and security alerts.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-3 p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
          <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white">Welcome to LinkGuard Platform</h4>
            <p className="text-xs text-slate-400">Your account is fully active and protected by our security telemetry and Redis cache engine.</p>
            <span className="text-[10px] text-slate-500 block pt-1">Just now</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
