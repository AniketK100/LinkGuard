import React from 'react';
import { Shield, Code2, Cpu, Globe } from 'lucide-react';

const pillars = [
  { icon: Code2, title: 'Open Control Panel', desc: 'Enterprise-grade URL management platform with collision-safe slug generation and persistent link storage.' },
  { icon: Cpu, title: 'High-Speed Redirection', desc: 'Sub-100ms URL redirection engine built for high-throughput link management and instant routing.' },
  { icon: Shield, title: 'Privacy by Design', desc: 'All visitor IPs are SHA-256 hashed before storage. We never possess, transmit, or log raw addresses.' },
  { icon: Globe, title: 'Enterprise RBAC', desc: 'Role-based access control, immutable audit logs, JWT rotation with reuse detection, and host verification.' },
];

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 space-y-16">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-text-primary tracking-tight">About LinkGuard</h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          LinkGuard is a self-hosted, enterprise-grade URL-shortening platform built to provide high-performance link management, privacy telemetry, and security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pillars.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className="bg-surface border border-hairline rounded-xl p-5 space-y-3 hover:border-accent/20 transition-colors duration-200">
              <div className="p-2 rounded-lg bg-accent/5 border border-accent/10 text-accent w-fit">
                <Icon className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-text-primary">{p.title}</h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">{p.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-surface border border-hairline rounded-xl p-6 space-y-4">
        <h2 className="text-base font-bold text-text-primary">Core Capabilities</h2>
        <div className="flex flex-wrap gap-2">
          {['Sub-100ms Redirects', 'SHA-256 IP Privacy', 'Base62 Slug Generation', 'Dynamic QR Studio', 'Password Guards', 'RBAC Security', 'Click Telemetry', 'Distributed Rate Limiting'].map((cap) => (
            <span key={cap} className="mono-pill">{cap}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
