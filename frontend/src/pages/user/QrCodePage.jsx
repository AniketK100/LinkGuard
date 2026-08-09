import React, { useState, useEffect } from 'react';
import { Download, Palette } from 'lucide-react';
import Button from '../../components/common/Button';
import api from '../../lib/axios';

export function QrCodePage() {
  const [urls, setUrls] = useState([]);
  const [selectedUrlId, setSelectedUrlId] = useState('');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [format, setFormat] = useState('PNG');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/v1/urls').then((res) => {
      if (res.data?.success) {
        const list = res.data.data.content || [];
        setUrls(list);
        if (list.length > 0) setSelectedUrlId(list[0].id.toString());
      }
    }).finally(() => setLoading(false));
  }, []);

  const selectedUrl = urls.find((u) => u.id.toString() === selectedUrlId.toString());

  const backendBase = import.meta.env.VITE_API_BASE_URL || 'https://linkguard-flve.onrender.com';
  const qrTargetUrl = selectedUrl ? `${backendBase}/${selectedUrl.shortCode}` : '';

  const fgHex = foregroundColor.replace('#', '');
  const bgHex = backgroundColor.replace('#', '');

  const qrImageUrl = qrTargetUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrTargetUrl)}&color=${fgHex}&bgcolor=${bgHex}&format=${format.toLowerCase()}`
    : '';

  const handleDownload = () => {
    if (!qrImageUrl) return;
    const a = document.createElement('a');
    a.href = qrImageUrl;
    a.download = `qr_${selectedUrl?.shortCode || 'link'}.${format.toLowerCase()}`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-lg font-bold text-text-primary">Dynamic QR Code Studio</h1>
        <p className="text-xs text-text-tertiary mt-0.5">Customize and download scannable vector PNG and SVG QR codes for marketing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customization Options */}
        <div className="bg-surface border border-hairline p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-bold text-text-primary flex items-center gap-2">
            <Palette className="w-4 h-4 text-accent" strokeWidth={1.75} />
            <span>Design Customization</span>
          </h3>

          {loading ? (
            <p className="text-xs text-text-tertiary">Loading links…</p>
          ) : urls.length === 0 ? (
            <p className="text-xs text-text-tertiary">No short links available. Create a link first.</p>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">Target Link</label>
                <div className="relative">
                  <select
                    value={selectedUrlId}
                    onChange={(e) => setSelectedUrlId(e.target.value)}
                    className="w-full appearance-none px-3 pr-8 py-2 bg-canvas border border-hairline rounded-lg text-xs font-mono text-text-primary focus:outline-none focus:border-accent/40 transition-colors duration-100 cursor-pointer"
                  >
                    {urls.map((u) => (
                      <option key={u.id} value={u.id} className="bg-surface text-text-primary">
                        /{u.shortCode} — {u.originalUrl.substring(0, 35)}…
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-3.5 h-3.5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
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

              <Button onClick={handleDownload} disabled={!selectedUrl} variant="primary" className="w-full justify-center mt-2" icon={Download}>
                Download QR Code ({format})
              </Button>
            </div>
          )}
        </div>

        {/* Live Preview Card */}
        <div className="bg-surface border border-hairline p-6 rounded-xl flex flex-col items-center justify-center space-y-4 min-h-[300px]">
          <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-widest">Live Scannable QR Code</span>
          {qrImageUrl ? (
            <div className="p-4 rounded-2xl flex items-center justify-center border border-hairline shadow-md" style={{ backgroundColor }}>
              <img
                src={qrImageUrl}
                alt={`QR Code for /${selectedUrl?.shortCode}`}
                className="w-48 h-48 rounded-lg object-contain"
              />
            </div>
          ) : (
            <div className="w-48 h-48 bg-surface-2 rounded-2xl border border-hairline flex items-center justify-center text-xs text-text-tertiary">
              Select a URL to render QR code
            </div>
          )}
          {selectedUrl && (
            <div className="text-center space-y-1">
              <p className="text-xs font-mono font-semibold text-accent">/{selectedUrl.shortCode}</p>
              <p className="text-[10px] text-text-tertiary truncate max-w-xs">{selectedUrl.originalUrl}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QrCodePage;
