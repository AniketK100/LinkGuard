import React from 'react';
import { Shield, Award, Users, Server } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-slate-300">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">About LinkGuard</h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto">
          We build robust, high-performance infrastructure for modern URL management, security analysis, and traffic intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
          <Server className="w-6 h-6 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Mission</h3>
          <p className="text-slate-400 leading-relaxed">
            To provide developers and organizations with ultra-fast URL shortening, bulletproof security guards, and deep analytics without compromising user privacy.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
          <Shield className="w-6 h-6 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Security First</h3>
          <p className="text-slate-400 leading-relaxed">
            Built with Spring Boot 3.4, Java 21, and Redis. Equipped with SHA-256 IP anonymization, rate limiting, and automated SSRF host verification.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
