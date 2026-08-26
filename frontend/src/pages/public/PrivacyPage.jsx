import React from 'react';
import { Shield, Lock, EyeOff, Server, FileCheck, UserCheck } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 lg:py-24 space-y-10">
      <div className="space-y-3 text-center sm:text-left border-b border-hairline pb-8">
        <div className="flex items-center gap-2 text-accent text-xs font-mono font-bold uppercase tracking-widest">
          <Shield className="w-4 h-4" /> Privacy & Compliance Policy
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-text-primary tracking-tight">
          LinkGuard Privacy Policy & Data Protections
        </h1>
        <p className="text-sm text-text-secondary">Effective Date: August 2026 | Version 2.4 (GDPR & CCPA Compliant)</p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-text-secondary leading-relaxed">
        <section className="bg-surface border border-hairline p-6 sm:p-8 rounded-2xl space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Lock className="w-4 h-4 text-accent" /> 1. Overview & Privacy-First Philosophy
          </h2>
          <p>
            LinkGuard Platform Inc. ("LinkGuard", "we", "our") operates the URL shortening and analytics platform available at <code className="text-emerald-400 font-mono">https://link-guard-two.vercel.app</code>. We are committed to maintaining the highest standard of user and visitor privacy. Unlike legacy analytics providers, LinkGuard is architected to eliminate unnecessary personal tracking.
          </p>
        </section>

        <section className="bg-surface border border-hairline p-6 sm:p-8 rounded-2xl space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-accent" /> 2. SHA-256 IP Anonymization (GDPR & CCPA Standard)
          </h2>
          <p>
            When a visitor clicks a shortened URL, their IP address is processed temporarily in memory strictly for routing. Raw IP addresses are **never written to disk or database tables**.
          </p>
          <p>
            Instead, our backend instantly passes incoming IP addresses through a <code className="text-emerald-400 font-mono">SHA-256</code> cryptographic hashing function using a daily rotating secret salt key (<code className="text-text-primary font-mono">SECURITY_IP_HASH_SALT</code>). This generates an irreversible cryptographic digest used exclusively for:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Calculating unique visitor counts over sliding time windows.</li>
            <li>Preventing automated bot abuse, spamming, and Denial-of-Service attacks.</li>
          </ul>
        </section>

        <section className="bg-surface border border-hairline p-6 sm:p-8 rounded-2xl space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Server className="w-4 h-4 text-accent" /> 3. Information Collection & Telemetry
          </h2>
          <p>We collect only minimal data required to deliver core functionality:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-text-primary">Account Credentials:</strong> When creating a workspace, we store your display name and email address encrypted via BCrypt password hashing.</li>
            <li><strong className="text-text-primary">Aggregated Link Telemetry:</strong> Non-personally identifiable metrics including coarse country location (derived from reverse proxy headers), device family (Mobile/Desktop/Tablet), browser type, and HTTP Referrer.</li>
            <li><strong className="text-text-primary">Cookies & Local Storage:</strong> We use strictly necessary local storage items to persist JWT authentication sessions and dark/light theme preferences. No third-party ad-tracking cookies are set.</li>
          </ul>
        </section>

        <section className="bg-surface border border-hairline p-6 sm:p-8 rounded-2xl space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-accent" /> 4. Your Rights & Data Portability
          </h2>
          <p>
            Under GDPR and CCPA regulations, registered users maintain full ownership of their data. You may export your link history and click analytics CSV reports at any time, or request complete account deletion by contacting <code className="text-text-primary font-mono">privacy@linkguard.app</code>.
          </p>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPage;
