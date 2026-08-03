import React, { useState, useEffect } from 'react';
import { Link2, BarChart3, QrCode, Plus, Copy, Check, ExternalLink, Trash2 } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Modal from '../../components/common/Modal';
import api from '../../lib/axios';

export function UserDashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [title, setTitle] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await api.get('/api/v1/urls');
      if (response.data?.success) {
        setUrls(response.data.data.content || []);
      }
    } catch (err) {
      console.error('Failed to fetch URLs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUrl = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/v1/urls', {
        originalUrl,
        customAlias: customAlias.trim() || undefined,
        title: title.trim() || undefined,
      });
      if (response.data?.success) {
        setIsModalOpen(false);
        setOriginalUrl('');
        setCustomAlias('');
        setTitle('');
        fetchUrls();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create short URL');
    }
  };

  const handleDeleteUrl = async (id) => {
    if (!window.confirm('Are you sure you want to delete this short URL?')) return;
    try {
      await api.delete(`/api/v1/urls/${id}`);
      fetchUrls();
    } catch (err) {
      alert('Failed to delete URL');
    }
  };

  const copyShortUrl = (shortCode, id) => {
    const fullUrl = window.location.origin + '/' + shortCode;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalClicks = urls.reduce((sum, u) => sum + (u.clickCount || 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-slate-400">Manage your active links, view click performance, and generate QR codes.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20 w-fit"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create Short Link</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Short Links" value={urls.length} icon={Link2} color="emerald" />
        <StatCard title="Total Clicks Tracked" value={totalClicks} icon={BarChart3} color="cyan" />
        <StatCard title="Active Campaigns" value={urls.filter(u => u.status === 'ACTIVE').length} icon={QrCode} color="violet" />
      </div>

      {/* Recent Links Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Recent Short Links</h3>
          <span className="text-xs text-slate-500">{urls.length} items</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading links...</div>
        ) : urls.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">No links created yet. Click "Create Short Link" above to start.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3 font-semibold">Short Link</th>
                  <th className="px-6 py-3 font-semibold">Original Destination</th>
                  <th className="px-6 py-3 font-semibold">Clicks</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {urls.map((urlItem) => (
                  <tr key={urlItem.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-emerald-400">
                      /{urlItem.shortCode}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-slate-400">
                      {urlItem.originalUrl}
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      {urlItem.clickCount}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {urlItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => copyShortUrl(urlItem.shortCode, urlItem.id)}
                        className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="Copy"
                      >
                        {copiedId === urlItem.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteUrl(urlItem.id)}
                        className="p-1.5 rounded-md hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Link Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Short Link">
        <form onSubmit={handleCreateUrl} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Destination URL</label>
            <input
              type="url"
              required
              placeholder="https://example.com/target-page"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Custom Alias (Optional)</label>
            <input
              type="text"
              placeholder="my-custom-slug"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Title (Optional)</label>
            <input
              type="text"
              placeholder="Campaign Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-xs font-semibold rounded-lg hover:from-emerald-400 hover:to-cyan-400"
            >
              Create Link
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default UserDashboard;
