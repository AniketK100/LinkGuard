import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Lock, BarChart3, QrCode, ArrowRight, Copy, Check, Sparkles } from 'lucide-react';
import api from '../../lib/axios';

export function LandingPage() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/v1/urls', { originalUrl: url });
      if (response.data?.success) {
        const fullShort = window.location.origin + '/' + response.data.data.shortCode;
        setShortUrl(fullShort);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to shorten URL. Check format.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto px-4 space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation URL Management Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Intelligent Short Links with{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Enterprise Security
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Shorten, track, secure, and analyze your URLs in real time. Powered by high-speed Redis caching, privacy-compliant telemetry, and custom QR codes.
        </p>

        {/* Shortener Box */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-2xl max-w-2xl mx-auto space-y-4">
          <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              placeholder="Paste your long link here (e.g. https://example.com/very-long-path)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {error && <p className="text-xs text-rose-400 font-medium text-left px-1">{error}</p>}

          {shortUrl && (
            <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-emerald-500/30 rounded-xl text-sm animate-fade-in">
              <span className="font-mono text-emerald-400 font-medium truncate">{shortUrl}</span>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-500/30 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-white">Built for Modern Teams</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Everything you need to create, manage, and safeguard high-volume links.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl space-y-4 hover:border-slate-700 transition-colors">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl w-fit">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Sub-millisecond Resolution</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Redis cache-aside strategy ensures high-speed redirects even under heavy traffic spikes.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl space-y-4 hover:border-slate-700 transition-colors">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl w-fit">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Real-Time Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Track clicks, unique visitors, devices, browsers, and geographic country distributions.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl space-y-4 hover:border-slate-700 transition-colors">
            <div className="p-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl w-fit">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Security & Password Protection</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Protect links with custom passwords, set expiration dates, and trigger automatic SSRF guards.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
