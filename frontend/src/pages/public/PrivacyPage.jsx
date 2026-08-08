import React from 'react';
import { Shield, Lock, EyeOff, Server } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 lg:py-24 space-y-10">
      <div className="space-y-3 text-center sm:text-left border-b border-hairline pb-8">
        <div className="flex items-center gap-2 text-accent text-xs font-mono font-bold uppercase tracking-widest">
          <Shield className="w-4 h-4" /> Privacy & Compliance
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-text-primary tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-text-secondary">Last updated: August 2026</p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-text-secondary leading-relaxed">
        <section className="bg-surface border border-hairline p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Lock className="w-4 h-4 text-accent" /> 1. Overview & Data Philosophy
          </h2>
          <p>
            LinkGuard is engineered with privacy as a foundational principle. We build tools to shorten, secure, and analyze links without compromising the personal privacy of visitors or creators.
          </p>
        </section>

        <section className="bg-surface border border-hairline p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-accent" /> 2. SHA-256 IP Anonymization (GDPR Compliance)
          </h2>
          <p>
            When a visitor clicks a shortened link, their IP address is never stored in raw form. Our backend instantly passes IP addresses through a SHA-256 cryptographic hashing algorithm with a daily rotating salt key (`SECURITY_IP_HASH_SALT`).
          </p>
          <p>
            This produces an irreversible hash used solely to count unique visitors and prevent DDoS/spam attacks, adhering strictly to GDPR guidelines.
          </p>
        </section>

        <section className="bg-surface border border-hairline p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Server className="w-4 h-4 text-accent" /> 3. Data Collection & Usage
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-text-primary">Account Data:</strong> When registering, we collect your name and email to manage your workspace and links.</li>
            <li><strong className="text-text-primary">Link Metrics:</strong> We log aggregated referrer source, country code, device type, and browser family for link analytics.</li>
            <li><strong className="text-text-primary">Cookies:</strong> We use strictly necessary local storage items for authentication tokens and dark/light theme preferences. No third-party tracking cookies are set.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPage;
