import React from 'react';
import { Globe, QrCode, Lock, RefreshCw, Shield, Cpu, BarChart3, Zap } from 'lucide-react';

const features = [
  { title: 'Custom Short Links', desc: 'Create custom slugs and branded short links that are easy to remember and share.', icon: Globe },
  { title: 'QR Code Studio', desc: 'Create and download custom QR codes in PNG or SVG formats with your choice of colors.', icon: QrCode },
  { title: 'Password Protection', desc: 'Secure any destination link with a password so only authorized visitors can open it.', icon: Lock },
  { title: 'Link Expiration', desc: 'Set links to automatically expire or deactivate after a specific date or time.', icon: RefreshCw },
  { title: 'Privacy Protection', desc: 'All visitor IP addresses are fully anonymized. We never store or log personal data.', icon: Shield },
  { title: 'Instant Speed', desc: 'High-speed redirection engine ensuring sub-100ms load times for all visitors.', icon: Cpu },
  { title: 'Click Analytics', desc: 'View detailed insights by country, device, browser, and referring websites.', icon: BarChart3 },
  { title: 'Spam Protection', desc: 'Automatic rate limiting prevents spam attacks and keeps your links safe.', icon: Zap },
];

export function FeaturesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-20 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-bold text-text-primary tracking-tight">Platform Features</h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          Everything you need to create, track, and protect your links.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div key={idx} className="bg-surface border border-hairline rounded-xl p-5 space-y-3 group hover:border-accent/20 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/5 border border-accent/10 text-accent">
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <h3 className="text-sm font-bold text-text-primary">{feat.title}</h3>
              </div>
              <p className="text-[13px] text-text-secondary leading-relaxed">{feat.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FeaturesPage;
