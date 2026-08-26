import React from 'react';
import { Shield, Code2, Cpu, Globe, CheckCircle, Server, Lock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const pillars = [
  { icon: Code2, title: 'Open Control Panel', desc: 'Enterprise-grade URL management platform with collision-safe Base62 slug generation and persistent link storage.' },
  { icon: Cpu, title: 'Sub-10ms Redirection Speed', desc: 'Distributed Redis 8 in-memory cache-aside engine built for high-throughput link management and instant routing.' },
  { icon: Shield, title: 'SHA-256 IP Privacy by Design', desc: 'All visitor IPs are SHA-256 hashed with daily rotating salts before storage. We never possess, transmit, or log raw IP addresses.' },
  { icon: Globe, title: 'Enterprise Role-Based Control (RBAC)', desc: 'Role-based access control, immutable audit logs, JWT rotation with reuse detection, and host verification.' },
];

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 lg:py-24 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-bold">
          <Award className="w-3.5 h-3.5" /> About LinkGuard Platform
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-text-primary tracking-tight">
          Enterprise Link Infrastructure Built for Speed & Privacy
        </h1>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          LinkGuard Platform Inc. is an enterprise-grade URL shortening, analytics, and link management service. Designed from the ground up to combine sub-10ms Redis redirect speed with uncompromising GDPR privacy compliance and real-time visitor telemetry.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pillars.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className="bg-surface border border-hairline rounded-xl p-6 space-y-3 hover:border-accent/20 transition-colors duration-200 shadow-sm">
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent w-fit">
                <Icon className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-base font-bold text-text-primary">{p.title}</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{p.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Deep Mission Section */}
      <div className="bg-surface border border-hairline rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <Server className="w-5 h-5 text-accent" /> Infrastructure Architecture & Values
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Modern digital operations demand link infrastructure that is fast, resilient, and respectful of user data. Legacy link shorteners sell visitor tracking data or inject tracking scripts. LinkGuard takes the opposite approach: we utilize cryptographic hashing to aggregate click statistics (country, device, browser) without ever capturing or storing personally identifiable raw IP addresses.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-text-primary">
          {[
            'High-Throughput Redis 8 Cache',
            'ACID-Compliant PostgreSQL Storage',
            'Collision-Free Base62 Encoder',
            'Vector & Raster QR Code Studio',
            'JWT Access & Refresh Token Auth',
            'OpenAPI 3.0 Machine-Readable Spec'
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4 pt-4">
        <h3 className="text-lg font-bold text-text-primary">Explore LinkGuard Developer & Platform Resources</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/docs"><Button icon={Code2}>API Documentation</Button></Link>
          <Link to="/contact"><Button variant="secondary">Contact Support</Button></Link>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
