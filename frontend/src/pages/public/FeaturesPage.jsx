import React from 'react';
import { Globe, QrCode, Lock, RefreshCw, Shield, Cpu, BarChart3, Zap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const features = [
  { title: 'Custom Short Links', desc: 'Create custom slugs and branded short links that are memorable, easy to share, and simple to embed in marketing campaigns.', icon: Globe },
  { title: 'Dynamic QR Code Studio', desc: 'Generate and download vector SVG or raster PNG QR codes with customizable color themes for print and digital media.', icon: QrCode },
  { title: 'BCrypt Password Protection', desc: 'Secure any destination link with strong BCrypt password validation so only authorized visitors can access your content.', icon: Lock },
  { title: 'Scheduled Link Expiration', desc: 'Set links to automatically expire or deactivate after a specific date, time, or total click threshold.', icon: RefreshCw },
  { title: 'SHA-256 Visitor Privacy', desc: 'All visitor IP addresses are instantly hashed with daily rotating cryptographic salts. Zero raw IP logging for full GDPR compliance.', icon: Shield },
  { title: 'Sub-10ms Redis Redirection Engine', desc: 'High-speed cache-aside architecture delivers sub-10ms redirection response times worldwide.', icon: Cpu },
  { title: 'Real-Time Click Telemetry', desc: 'View granular visitor insights including geographic country distribution, device types, browser families, and referrers.', icon: BarChart3 },
  { title: 'Distributed Rate Limiting & Protection', desc: 'Automatic sliding-window rate limiting prevents bot spam attacks and safeguards infrastructure stability.', icon: Zap },
];

export function FeaturesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" /> High-Performance Capabilities
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-text-primary tracking-tight">
          Enterprise URL Infrastructure Features
        </h1>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          Discover the complete suite of high-speed URL shortening, vector QR code generation, password protection, and privacy-first analytics tools.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div key={idx} className="bg-surface border border-hairline rounded-2xl p-6 sm:p-7 space-y-4 group hover:border-accent/30 transition-all duration-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-accent flex-shrink-0">
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-text-primary">{feat.title}</h2>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{feat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="bg-surface border border-hairline rounded-2xl p-8 text-center space-y-4 max-w-3xl mx-auto shadow-lg">
        <h2 className="text-xl font-bold text-text-primary">Ready to streamline your links?</h2>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Start creating secure, high-speed short links with real-time telemetry today.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link to="/register"><Button>Get Started Free</Button></Link>
          <Link to="/docs"><Button variant="secondary">API Documentation</Button></Link>
        </div>
      </div>
    </div>
  );
}

export default FeaturesPage;
