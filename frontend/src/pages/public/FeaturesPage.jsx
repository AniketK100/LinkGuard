import React from 'react';
import { Shield, Zap, BarChart3, QrCode, Lock, Globe, Cpu, RefreshCw } from 'lucide-react';

export function FeaturesPage() {
  const features = [
    { title: 'Custom Aliases', desc: 'Create brandable short codes that match your business name.', icon: Globe },
    { title: 'Dynamic QR Codes', desc: 'Generate customized PNG and SVG QR codes with logo embedding.', icon: QrCode },
    { title: 'Password Protection', desc: 'Secure sensitive destinations with bcrypt-hashed passwords.', icon: Lock },
    { title: 'Expiration Control', desc: 'Automatically disable links after a specific time or click count.', icon: RefreshCw },
    { title: 'Privacy Telemetry', desc: 'SHA-256 IP anonymization ensures full GDPR & privacy compliance.', icon: Shield },
    { title: 'Sub-millisecond Latency', desc: 'Redis cache-aside engine ensures maximum redirection throughput.', icon: Cpu },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Enterprise Features</h1>
        <p className="text-slate-400 text-base">
          Discover all capabilities built directly into LinkGuard to streamline your link management workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div key={idx} className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl w-fit">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">{feat.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FeaturesPage;
