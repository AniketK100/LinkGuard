import React, { useState } from 'react';
import { Settings, Save, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';

export function AdminConfigPage() {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    maxUrlLength: '2048',
    rateLimitRequests: '60',
    jwtExpiration: '900',
    requireEmailVerification: false,
    allowAnonymousShortening: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      <div>
        <h1 className="text-base sm:text-lg font-bold text-text-primary">System Configuration</h1>
        <p className="text-[11px] sm:text-xs text-text-tertiary mt-0.5">Global platform parameters, rate limit bounds, and security defaults.</p>
      </div>

      <form onSubmit={handleSave} className="bg-surface border border-hairline p-4 sm:p-6 rounded-xl space-y-4 max-w-2xl w-full shadow-sm">
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">Max Destination URL Length (Bytes)</label>
            <input
              type="number"
              value={config.maxUrlLength}
              onChange={(e) => setConfig({ ...config, maxUrlLength: e.target.value })}
              className="w-full px-3 py-2 sm:py-1.5 rounded-lg bg-surface-2 border border-hairline text-xs font-mono focus:outline-none focus:border-accent/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">IP Rate Limit (Requests per Minute)</label>
            <input
              type="number"
              value={config.rateLimitRequests}
              onChange={(e) => setConfig({ ...config, rateLimitRequests: e.target.value })}
              className="w-full px-3 py-2 sm:py-1.5 rounded-lg bg-surface-2 border border-hairline text-xs font-mono focus:outline-none focus:border-accent/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">JWT Access Token Validity (Seconds)</label>
            <input
              type="number"
              value={config.jwtExpiration}
              onChange={(e) => setConfig({ ...config, jwtExpiration: e.target.value })}
              className="w-full px-3 py-2 sm:py-1.5 rounded-lg bg-surface-2 border border-hairline text-xs font-mono focus:outline-none focus:border-accent/40"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-text-primary">Allow Guest Anonymous Shortening</span>
            <input
              type="checkbox"
              checked={config.allowAnonymousShortening}
              onChange={(e) => setConfig({ ...config, allowAnonymousShortening: e.target.checked })}
              className="w-4 h-4 rounded border-hairline accent-accent cursor-pointer shrink-0"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button type="submit" variant="primary" size="sm" icon={Save} className="justify-center py-2 sm:py-1.5">
            Save Configuration
          </Button>
          {saved && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Settings updated successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

export default AdminConfigPage;
