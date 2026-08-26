import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import api from '../../lib/axios';
import { trackEvent } from '../../lib/posthog';
import { ArrowRight, Copy, Check, Zap, BarChart3, Lock, QrCode, Shield, AlertCircle } from 'lucide-react';

export function LandingPage() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationModal, setValidationModal] = useState('');
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStatsVisible(true);
    }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    const token = localStorage.getItem('token');
    const guestCreated = localStorage.getItem('linkguard_guest_url_created');

    // Enforce guest limit: only 1 short URL allowed without an account
    if (!token && guestCreated === 'true') {
      const msg = 'Guest limit reached (1 short link max). Please create a free account or log in to shorten unlimited URLs!';
      setError(msg);
      setValidationModal(msg);
      return;
    }

    setLoading(true);
    setError('');
    setValidationModal('');
    try {
      const response = await api.post('/api/v1/urls', { originalUrl: url.trim() });
      if (response.data?.success) {
        const backendBase = import.meta.env.VITE_API_BASE_URL || window.location.origin;
        setShortUrl(backendBase + '/' + response.data.data.shortCode);
        if (!token) {
          localStorage.setItem('linkguard_guest_url_created', 'true');
        }

        let targetDomain = '';
        try {
          targetDomain = new URL(url.trim()).hostname;
        } catch (ignored) {}

        trackEvent('short_url_created', {
          domain: targetDomain,
          urlLength: url.trim().length,
          isCustomAlias: false,
          isPasswordProtected: false,
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Validation failed for request fields';
      setError(msg);
      setValidationModal(msg);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { label: 'Redirect Speed', value: '<100ms' },
    { label: 'Privacy', value: '100% Secure' },
    { label: 'Custom Slugs', value: 'Instant' },
    { label: 'Analytics', value: 'Real-Time' },
  ];

  return (
    <div className="noise-overlay">
      {/* First Screen Fold (Viewport height: Navbar + Centered Hero + Bottom Stats Bar) */}
      <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-between">
        {/* Centered Hero Section */}
        <section className="flex-1 flex flex-col justify-center items-center max-w-5xl mx-auto px-4 py-8 text-center space-y-8 w-full">
          <h1 id="main-heading" className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.1]">
            Enterprise URL Shortener &amp;<br />
            <span className="text-text-primary underline decoration-2 underline-offset-8">Analytics Platform</span>
          </h1>

          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Control room for your links: fast, reliable URL shortening with real-time analytics, privacy protection, and customizable QR codes.
          </p>

          {/* Live shortener - Pill Input Form */}
          <div className="bg-surface border border-hairline p-2 sm:p-3.5 rounded-2xl sm:rounded-full max-w-2xl w-full mx-auto text-left relative z-10 shadow-md">
            <form onSubmit={handleShorten} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <input
                type="url"
                placeholder="Paste a long URL to shorten…"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 bg-transparent border-0 text-text-primary placeholder-text-tertiary focus:outline-none text-xs sm:text-base font-mono w-full min-w-0"
              />
              <Button type="submit" disabled={loading} icon={ArrowRight} size="lg" className="rounded-xl sm:rounded-full flex-shrink-0 w-full sm:w-auto justify-center">
                {loading ? 'Shortening…' : 'Shorten'}
              </Button>
            </form>

            {error && <p className="text-xs text-red-500 font-medium px-4 sm:px-6 pt-2">{error}</p>}
          </div>

          {shortUrl && (
            <div className="max-w-2xl w-full mx-auto flex items-center justify-between p-4 bg-surface border border-hairline rounded-2xl animate-fade-in shadow-md">
              <span className="font-mono text-sm sm:text-base text-text-primary font-bold truncate px-2">{shortUrl}</span>
              <button onClick={copyToClipboard} className="flex items-center gap-2 px-5 py-2.5 bg-black text-white dark:bg-white dark:text-black text-xs font-extrabold uppercase rounded-full hover:opacity-90 transition-opacity">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}
        </section>

        {/* Stats Counter Bar at Bottom of First Fold */}
        <section ref={statsRef} className="border-y border-hairline bg-surface py-8 shadow-sm w-full">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i} className={`space-y-1 transition-all duration-500 ease-out-expo ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-text-primary tracking-tight">{s.value}</div>
                <div className="text-[11px] sm:text-xs text-text-tertiary uppercase tracking-widest font-bold">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Below the Fold Content (Appears on Scroll) */}
      <section className="max-w-5xl mx-auto px-4 py-20 lg:py-28 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary">
            Everything you need for link management
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-lg mx-auto">
            Built for speed, privacy, and ease of use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tile 1 */}
          <div className="md:col-span-2 bg-surface border border-hairline rounded-2xl p-8 space-y-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-surface-2 border border-hairline text-text-primary">
                <BarChart3 className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="font-display text-xl font-extrabold text-text-primary">Real-Time Analytics</h3>
            </div>
            <p className="text-base text-text-secondary leading-relaxed">
              Track clicks by location, device, browser, and referral source. All visitor data is anonymized to ensure complete privacy.
            </p>
            <div className="flex gap-2 flex-wrap pt-2">
              {['Countries', 'Devices', 'Browsers', 'Sources'].map((t) => (
                <span key={t} className="mono-pill text-xs font-bold px-3 py-1">{t}</span>
              ))}
            </div>
          </div>

          {/* Tile 2 */}
          <div className="bg-surface border border-hairline rounded-2xl p-8 space-y-4 shadow-md">
            <div className="p-3 rounded-xl bg-surface-2 border border-hairline text-text-primary w-fit">
              <QrCode className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="font-display text-xl font-extrabold text-text-primary">Custom QR Codes</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Generate customizable QR codes with custom colors and download them in PNG or SVG formats.
            </p>
          </div>

          {/* Tile 3 */}
          <div className="bg-surface border border-hairline rounded-2xl p-8 space-y-4 shadow-md">
            <div className="p-3 rounded-xl bg-surface-2 border border-hairline text-text-primary w-fit">
              <Shield className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="font-display text-xl font-extrabold text-text-primary">Advanced Security</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Protect your links from spam, rate limit abuse, and unauthorized access with built-in security guards.
            </p>
          </div>

          {/* Tile 4 */}
          <div className="md:col-span-2 bg-surface border border-hairline rounded-2xl p-8 space-y-4 shadow-md flex flex-col sm:flex-row gap-6">
            <div className="flex-1 space-y-3">
              <div className="p-3 rounded-xl bg-surface-2 border border-hairline text-text-primary w-fit">
                <Zap className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="font-display text-xl font-extrabold text-text-primary">Instant Redirection</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Links open in less than 100ms so your visitors never experience delay or waiting screens.
              </p>
            </div>
            <div className="flex-1 space-y-3">
              <div className="p-3 rounded-xl bg-surface-2 border border-hairline text-text-primary w-fit">
                <Lock className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="font-display text-xl font-extrabold text-text-primary">Password Protection</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Set a password on any link so only people with the key can open the destination URL.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 space-y-10 border-t border-hairline">
        <div className="text-center space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            How LinkGuard Works
          </h2>
          <p className="text-text-secondary text-base max-w-lg mx-auto">
            Three simple steps to shorten, brand, and analyze your destination links.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface border border-hairline p-6 rounded-2xl space-y-3">
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">Step 01</span>
            <h3 className="text-lg font-bold text-text-primary">Paste & Customize</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Input any long target URL. Optionally specify custom branded slugs and password locks.
            </p>
          </div>
          <div className="bg-surface border border-hairline p-6 rounded-2xl space-y-3">
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">Step 02</span>
            <h3 className="text-lg font-bold text-text-primary">Generate QR & Link</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Instantly receive a Base62 short URL and customizable vector PNG/SVG QR codes.
            </p>
          </div>
          <div className="bg-surface border border-hairline p-6 rounded-2xl space-y-3">
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">Step 03</span>
            <h3 className="text-lg font-bold text-text-primary">Track Privacy Telemetry</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Monitor click counts, geographic traffic breakdown, and device types with SHA-256 IP privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-8 border-t border-hairline">
        <div className="text-center space-y-2">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-text-secondary text-sm">Everything you need to know about LinkGuard URL shortener.</p>
        </div>

        <div className="space-y-4">
          {[
            { q: "How does LinkGuard ensure sub-100ms redirection speed?", a: "LinkGuard utilizes a Redis 8 cache-aside architecture. Short link lookup requests resolve directly from memory in under 10ms with database fallback." },
            { q: "Is visitor IP data kept private and GDPR compliant?", a: "Yes. Visitor IP addresses are immediately anonymized via SHA-256 hashing with a daily rotating salt key before analytics logging. No raw IPs are ever stored." },
            { q: "Can I customize the background and foreground colors of QR codes?", a: "Yes. Our Dynamic QR Studio allows you to customize foreground/background hex colors and export in raster PNG or vector SVG formats." },
            { q: "How does password protection work for short links?", a: "When password protection is enabled, visitors are prompted to enter a password before the 302 redirect unlocks the destination URL." },
            { q: "Is there a limit on how many links I can create?", a: "Free accounts include 50 active short links with complete click analytics and custom QR code downloads." }
          ].map((item, idx) => (
            <div key={idx} className="bg-surface border border-hairline p-5 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-text-primary">{item.q}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-24 text-center space-y-6">
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
          Start shortening links today
        </h2>
        <p className="text-text-secondary text-base">No credit card required. Free account includes 50 links with full analytics.</p>
        <div>
          <Link to="/register">
            <Button size="lg" icon={ArrowRight} className="px-8 py-3.5 text-sm sm:text-base">Create Free Account</Button>
          </Link>
        </div>
      </section>

      {/* Themed Validation Pop Up Modal */}
      <Modal isOpen={!!validationModal} onClose={() => setValidationModal('')} title={validationModal.includes('Guest limit') ? 'Guest Limit Reached' : 'Validation Notice'}>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-warning/10 border border-warning/20 flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-warning" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-text-primary">
                {validationModal.includes('Guest limit') ? 'Guest Limit Reached (1 Max)' : 'Notice'}
              </p>
              <p className="text-xs text-text-secondary">{validationModal}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            {validationModal.includes('Guest limit') ? (
              <>
                <Link to="/login"><Button variant="secondary" onClick={() => setValidationModal('')}>Log In</Button></Link>
                <Link to="/register"><Button onClick={() => setValidationModal('')}>Create Free Account</Button></Link>
              </>
            ) : (
              <Button onClick={() => setValidationModal('')} variant="primary">
                OK
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default LandingPage;
