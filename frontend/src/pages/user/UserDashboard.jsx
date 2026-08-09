import React, { useState, useEffect } from 'react';
import { Link2, MousePointer, QrCode, Plus, Copy, Check, AlertCircle } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import api from '../../lib/axios';

export function UserDashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => { fetchUrls(); }, []);

  const fetchUrls = () => {
    setLoading(true);
    api.get('/api/v1/urls')
      .then((res) => {
        if (res.data?.success) setUrls(res.data.data.content || []);
      })
      .finally(() => setLoading(false));
  };

  const handleCreateUrl = async (e) => {
    e.preventDefault();
    setCreating(true);
    setValidationError('');
    try {
      await api.post('/api/v1/urls', {
        originalUrl: originalUrl.trim(),
        customAlias: customAlias.trim() || undefined,
      });
      setOriginalUrl('');
      setCustomAlias('');
      setCreateModalOpen(false);
      fetchUrls();
    } catch (err) {
      const msg = err.response?.data?.message || 'Validation failed for request fields';
      setValidationError(msg);
    } finally {
      setCreating(false);
    }
  };

  const copyShortUrl = (shortCode, id) => {
    const backendBase = import.meta.env.VITE_API_BASE_URL || 'https://linkguard-flve.onrender.com';
    navigator.clipboard.writeText(backendBase + '/' + shortCode);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalClicks = urls.reduce((sum, u) => sum + (u.clickCount || 0), 0);

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-text-primary">Workspace</h1>
          <p className="text-xs text-text-tertiary mt-0.5">Monitor link performance, telemetry, and active aliases.</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} icon={Plus}>Create Short Link</Button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard title="Total Links" value={urls.length} icon={Link2} />
        <StatCard title="Total Clicks" value={totalClicks} icon={MousePointer} />
        <StatCard title="Active QR Codes" value={urls.length} icon={QrCode} />
      </div>

      {/* Data table */}
      <div className="bg-surface border border-hairline rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-hairline flex items-center justify-between">
          <h3 className="text-xs font-semibold text-text-primary">Recent Short Links</h3>
          <span className="text-[10px] text-text-tertiary font-mono">{urls.length} active</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-text-tertiary">Loading workspace links…</div>
        ) : urls.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-tertiary">No short links yet. Click "Create Short Link" above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-text-tertiary uppercase tracking-wider text-[9px] font-semibold border-b border-hairline">
                <tr>
                  <th className="px-4 py-2.5">Short Link</th>
                  <th className="px-4 py-2.5">Destination</th>
                  <th className="px-4 py-2.5">Clicks</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {urls.slice(0, 8).map((u) => (
                  <tr key={u.id} className="hover:bg-surface-2/50 transition-colors duration-100">
                    <td className="px-4 py-3 font-mono font-semibold text-accent text-[11px]">/{u.shortCode}</td>
                    <td className="px-4 py-3 max-w-xs truncate text-text-secondary text-[11px]">{u.originalUrl}</td>
                    <td className="px-4 py-3 font-mono font-bold text-text-primary">{u.clickCount}</td>
                    <td className="px-4 py-3">
                      <Badge variant={u.status === 'ACTIVE' ? 'active' : 'disabled'}>{u.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => copyShortUrl(u.shortCode, u.id)}
                        className="p-1.5 rounded-md text-text-tertiary hover:text-accent hover:bg-accent/5 transition-colors duration-100"
                        title="Copy Link"
                      >
                        {copiedId === u.id ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={createModalOpen} onClose={() => { setCreateModalOpen(false); setValidationError(''); }} title="Create New Short Link">
        <form onSubmit={handleCreateUrl} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">Destination URL</label>
            <input type="url" required value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)} placeholder="https://example.com/target" className="w-full px-3 py-2.5 bg-canvas border border-hairline rounded-lg text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent/40 font-mono transition-colors duration-100" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">Custom Alias <span className="text-text-tertiary">(Optional)</span></label>
            <input type="text" value={customAlias} onChange={(e) => setCustomAlias(e.target.value)} placeholder="my-custom-slug" className="w-full px-3 py-2.5 bg-canvas border border-hairline rounded-lg text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent/40 font-mono transition-colors duration-100" />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => { setCreateModalOpen(false); setValidationError(''); }}>Cancel</Button>
            <Button type="submit" disabled={creating}>{creating ? 'Creating…' : 'Create Link'}</Button>
          </div>
        </form>
      </Modal>

      {/* Themed Validation Failed Pop Up */}
      <Modal isOpen={!!validationError} onClose={() => setValidationError('')} title="Validation Failed">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-danger/10 border border-danger/20 flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-danger" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-text-primary">Validation failed for request fields</p>
              <p className="text-xs text-text-secondary">{validationError}</p>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={() => setValidationError('')} variant="primary">
              OK
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default UserDashboard;
