import React, { useState, useEffect } from 'react';
import { QrCode, Download, Palette } from 'lucide-react';
import Button from '../../components/common/Button';
import api from '../../lib/axios';

export function QrCodePage() {
  const [urls, setUrls] = useState([]);
  const [selectedUrlId, setSelectedUrlId] = useState('');
  const [foregroundColor, setForegroundColor] = useState('#6EE7B7');
  const [backgroundColor, setBackgroundColor] = useState('#101114');
  const [format, setFormat] = useState('PNG');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/v1/urls').then((res) => {
      if (res.data?.success) {
        const list = res.data.data.content || [];
        setUrls(list);
        if (list.length > 0) setSelectedUrlId(list[0].id);
      }
    }).finally(() => setLoading(false));
  }, []);

  const selectedUrl = urls.find((u) => u.id === Number(selectedUrlId));

  const handleDownload = () => {
    if (!selectedUrlId) return;
    window.open(`/api/v1/qr-codes/${selectedUrlId}/download?format=${format}&fgColor=${encodeURIComponent(foregroundColor)}&bgColor=${encodeURIComponent(backgroundColor)}`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-lg font-bold text-text-primary">Dynamic QR Code Studio</h1>
        <p className="text-xs text-text-tertiary mt-0.5">Customize vector PNG and SVG QR codes for print and web marketing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customization Options */}
        <div className="bg-surface border border-hairline p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-bold text-text-primary flex items-center gap-2">
            <Palette className="w-4 h-4 text-accent" strokeWidth={1.75} />
            <span>Design Customization</span>
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">Target Link</label>
              <select
                value={selectedUrlId}
                onChange={(e) => setSelectedUrlId(e.target.value)}
                className="w-full px-3 py-2 bg-canvas border border-hairline rounded-lg text-xs font-mono text-text-primary focus:outline-none focus:border-accent/40 transition-colors duration-100"
              >
                {urls.map((u) => (
                  <option key={u.id} value={u.id}>
                    /{u.shortCode} — {u.originalUrl.substring(0, 30)}…
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">Foreground</label>
                <div className="flex items-center gap-2 bg-canvas border border-hairline rounded-lg p-1.5">
                  <input
                    type="color"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    className="w-6 h-6 rounded bg-transparent border-0 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-text-secondary">{foregroundColor}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">Background</label>
                <div className="flex items-center gap-2 bg-canvas border border-hairline rounded-lg p-1.5">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-6 h-6 rounded bg-transparent border-0 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-text-secondary">{backgroundColor}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">Export Format</label>
              <div className="flex gap-2">
                {['PNG', 'SVG'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormat(f)}
                    className={`flex-1 py-2 rounded-lg border text-xs font-mono font-semibold transition-all duration-100 ${
                      format === f
                        ? 'bg-accent/10 border-accent/30 text-accent'
                        : 'bg-canvas border-hairline text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {f} {f === 'PNG' ? 'Raster' : 'Vector'}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleDownload} variant="primary" className="w-full justify-center mt-2" icon={Download}>
              Download QR Code ({format})
            </Button>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="bg-surface border border-hairline p-5 rounded-xl flex flex-col items-center justify-center space-y-4">
          <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-widest">Live Preview</span>
          <div className="p-8 rounded-2xl flex items-center justify-center border border-hairline shadow-inner" style={{ backgroundColor }}>
            <QrCode className="w-44 h-44" style={{ color: foregroundColor }} />
          </div>
          {selectedUrl && (
            <p className="text-xs font-mono font-semibold text-accent">/{selectedUrl.shortCode}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QrCodePage;
