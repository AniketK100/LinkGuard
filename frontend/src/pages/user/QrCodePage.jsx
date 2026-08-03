import React, { useState, useEffect } from 'react';
import { QrCode as QrIcon, Download, RefreshCw, Palette } from 'lucide-react';
import api from '../../lib/axios';

export function QrCodePage() {
  const [urls, setUrls] = useState([]);
  const [selectedUrlId, setSelectedUrlId] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');

  useEffect(() => {
    api.get('/api/v1/urls').then((res) => {
      if (res.data?.success && res.data.data.content?.length > 0) {
        setUrls(res.data.data.content);
        setSelectedUrlId(res.data.data.content[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedUrlId) return;
    fetchQrCode();
  }, [selectedUrlId]);

  const fetchQrCode = () => {
    setLoading(true);
    api.get(`/api/urls/${selectedUrlId}/qr`).then((res) => {
      if (res.data?.success) {
        setQrCode(res.data.data);
      }
    }).finally(() => setLoading(false));
  };

  const handleUpdateStyle = async (e) => {
    e.preventDefault();
    if (!qrCode) return;
    try {
      const response = await api.put(`/api/v1/qr-codes/${qrCode.id}`, {
        foregroundColor: fgColor,
        backgroundColor: bgColor,
      });
      if (response.data?.success) {
        setQrCode(response.data.data);
      }
    } catch (err) {
      alert('Failed to update QR code styling');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">QR Code Studio</h1>
          <p className="text-xs text-slate-400">Generate and customize vector SVG / high-res PNG QR codes for your short links.</p>
        </div>

        {urls.length > 0 && (
          <select
            value={selectedUrlId}
            onChange={(e) => setSelectedUrlId(e.target.value)}
            className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
          >
            {urls.map((u) => (
              <option key={u.id} value={u.id}>
                /{u.shortCode} - {u.title || u.originalUrl}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs">Loading QR Code...</div>
      ) : !qrCode ? (
        <div className="p-12 text-center text-slate-500 text-xs">Select a URL to generate QR code.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* QR Preview Box */}
          <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center space-y-6">
            <div className="p-4 rounded-xl shadow-2xl" style={{ backgroundColor: qrCode.backgroundColor }}>
              <img
                src={`/api/v1/qr-codes/${qrCode.id}/download?t=${new Date().getTime()}`}
                alt="QR Code"
                className="w-56 h-56 object-contain"
              />
            </div>
            <div className="flex gap-3">
              <a
                href={`/api/v1/qr-codes/${qrCode.id}/download`}
                download
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-xs font-semibold rounded-xl shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Download Image</span>
              </a>
            </div>
          </div>

          {/* Customization Form */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-400" />
              <span>Color Customization</span>
            </h3>

            <form onSubmit={handleUpdateStyle} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Foreground Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-slate-800 bg-slate-950 cursor-pointer"
                  />
                  <span className="font-mono text-xs text-white">{fgColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Background Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-slate-800 bg-slate-950 cursor-pointer"
                  />
                  <span className="font-mono text-xs text-white">{bgColor}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                Apply Styling
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default QrCodePage;
