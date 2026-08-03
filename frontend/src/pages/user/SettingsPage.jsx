import React from 'react';
import { Settings, Shield, Key } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Account Settings</h1>
        <p className="text-xs text-slate-400">Configure security settings and system preferences.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-emerald-400" />
          <span>API Key Management</span>
        </h3>
        <p className="text-xs text-slate-400">
          Generate API keys to interact programmatically with the LinkGuard REST endpoints.
        </p>
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors">
          Generate API Key
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
