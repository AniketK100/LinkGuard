import React, { useState, useEffect, useRef } from 'react';
import { Download, Palette, RefreshCw, Check, Copy } from 'lucide-react';
import QRCode from 'qrcode';
import Button from '../../components/common/Button';
import api from '../../lib/axios';
import { trackEvent } from '../../lib/posthog';

export function QrCodePage() {
  const [urls, setUrls] = useState([]);
  const [selectedUrlId, setSelectedUrlId] = useState('');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [format, setFormat] = useState('PNG');
  const [loading, setLoading] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrSvgData, setQrSvgData] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const originBase = window.location.origin;
  const qrTargetUrl = selectedUrl ? `${originBase}/${selectedUrl.shortCode}` : '';

  // Generate QR Code locally on Canvas/SVG whenever target URL, colors, or format changes
  useEffect(() => {
    if (!qrTargetUrl) {
      setQrDataUrl('');
      setQrSvgData('');
      return;
    }

    const opts = {
      width: 320,
      margin: 2,
      color: {
        dark: foregroundColor || '#000000',
        light: backgroundColor || '#FFFFFF',
      },
    };

    QRCode.toDataURL(qrTargetUrl, opts)
      .then((url) => setQrDataUrl(url))
      .catch(() => setQrDataUrl(''));

    QRCode.toString(qrTargetUrl, { ...opts, type: 'svg' })
      .then((svg) => setQrSvgData(svg))
      .catch(() => setQrSvgData(''));
  }, [qrTargetUrl, foregroundColor, backgroundColor]);

  const handleDownload = () => {
    if (!selectedUrl) return;
    setDownloading(true);
    try {
      if (format === 'SVG' && qrSvgData) {
        const blob = new Blob([qrSvgData], { type: 'image/svg+xml' });
        const blobUrl = URL.revokeObjectURL ? URL.createObjectURL(blob) : '';
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `qr_${selectedUrl.shortCode}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else if (qrDataUrl) {
        const a = document.createElement('a');
        a.href = qrDataUrl;
        a.download = `qr_${selectedUrl.shortCode}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      trackEvent('qr_code_downloaded', { format: format.toLowerCase() });
    } catch {
      alert('Failed to download QR code');
    } finally {
      setDownloading(false);
    }
  };

  const copyQrLink = () => {
    if (!qrTargetUrl) return;
    navigator.clipboard.writeText(qrTargetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <div>
        <h1 className="text-base sm:text-lg font-bold text-text-primary">Dynamic QR Code Studio</h1>
        <p className="text-[11px] sm:text-xs text-text-tertiary mt-0.5">Customize and download instant scannable vector PNG and SVG QR codes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* Customization Options */}
        <div className="bg-surface border border-hairline p-4 sm:p-5 rounded-xl space-y-4 shadow-sm w-full">
          <h3 className="text-xs font-bold text-text-primary flex items-center gap-2">
            <Palette className="w-4 h-4 text-accent flex-shrink-0" strokeWidth={1.75} />
            <span>Design Customization</span>
          </h3>

          {loading ? (
            <p className="text-xs text-text-tertiary">Loading links…</p>
          ) : urls.length === 0 ? (
            <p className="text-xs text-text-tertiary">No short links available. Create a short link first.</p>
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
                        /{u.shortCode} — {u.originalUrl.substring(0, 32)}…
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
                    <span className="text-xs font-mono text-text-secondary uppercase">{foregroundColor}</span>
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
                    <span className="text-xs font-mono text-text-secondary uppercase">{backgroundColor}</span>
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

              <Button onClick={handleDownload} disabled={!selectedUrl || downloading || !qrDataUrl} variant="primary" className="w-full justify-center mt-2" icon={Download}>
                {downloading ? 'Downloading…' : `Download QR Code (${format})`}
              </Button>
            </div>
          )}
        </div>

        {/* Live Preview Card */}
        <div className="bg-surface border border-hairline p-5 rounded-xl flex flex-col items-center justify-center space-y-4 min-h-[320px] shadow-sm w-full">
          <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-widest">Live Scannable QR Code</span>
          
          {qrDataUrl ? (
            <div className="p-4 rounded-2xl flex items-center justify-center border border-hairline shadow-lg transition-transform duration-200 hover:scale-102" style={{ backgroundColor }}>
              <img
                src={qrDataUrl}
                alt={`QR Code for /${selectedUrl?.shortCode}`}
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="w-48 h-48 sm:w-56 sm:h-56 bg-surface-2 rounded-2xl border border-hairline flex items-center justify-center text-xs text-text-tertiary p-4 text-center">
              Select a short link to render QR code
            </div>
          )}

          {selectedUrl && (
            <div className="text-center space-y-1 w-full max-w-xs px-2">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-xs font-mono font-bold text-accent">/{selectedUrl.shortCode}</span>
                <button onClick={copyQrLink} className="p-1 text-text-tertiary hover:text-accent transition-colors" title="Copy target link">
                  {copied ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-[10px] text-text-tertiary truncate font-mono">{selectedUrl.originalUrl}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QrCodePage;
