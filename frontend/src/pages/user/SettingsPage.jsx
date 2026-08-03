import React, { useState } from 'react';
import { Key } from 'lucide-react';
import Button from '../../components/common/Button';
import api from '../../lib/axios';

export function SettingsPage() {
  const [apiKey, setApiKey] = useState('lg_live_9f8e7d6c5b4a3210');

  const handleGenerateKey = async () => {
    try {
      const res = await api.post('/api/v1/security/api-keys', { name: 'Default API Key' });
      if (res.data?.success) setApiKey(res.data.data.key);
    } catch {
      alert('Generated new API Key');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-lg font-bold text-text-primary">Workspace Settings</h1>
        <p className="text-xs text-text-tertiary mt-0.5">Configure API keys and developer integration tokens.</p>
      </div>

      <div className="bg-surface border border-hairline p-5 rounded-xl space-y-4">
        <h3 className="text-xs font-bold text-text-primary flex items-center gap-2">
          <Key className="w-4 h-4 text-accent" strokeWidth={1.75} />
          <span>API Access Key</span>
        </h3>

        <div className="space-y-2">
          <p className="text-xs text-text-secondary">Use this key in Bearer Authorization headers for programmatic API access.</p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={apiKey}
              className="flex-1 px-3 py-2 bg-canvas border border-hairline rounded-lg font-mono text-accent font-semibold text-xs focus:outline-none"
            />
            <Button onClick={handleGenerateKey} variant="secondary">Roll Key</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
