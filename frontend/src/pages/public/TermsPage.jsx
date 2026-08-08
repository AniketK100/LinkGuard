import React from 'react';
import { FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 lg:py-24 space-y-10">
      <div className="space-y-3 text-center sm:text-left border-b border-hairline pb-8">
        <div className="flex items-center gap-2 text-accent text-xs font-mono font-bold uppercase tracking-widest">
          <FileText className="w-4 h-4" /> Legal
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-text-primary tracking-tight">Terms of Service</h1>
        <p className="text-sm text-text-secondary">Last updated: August 2026</p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-text-secondary leading-relaxed">
        <section className="bg-surface border border-hairline p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent" /> 1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using LinkGuard, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="bg-surface border border-hairline p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" /> 2. Acceptable Use Policy
          </h2>
          <p>
            LinkGuard strictly prohibits using our URL shortener for any of the following:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Phishing, malware distribution, or deceptive websites.</li>
            <li>Spam, unsolicited mass messaging, or bot operations.</li>
            <li>Content that violates copyright or intellectual property rights.</li>
          </ul>
          <p className="pt-1 text-xs text-text-tertiary">
            Violation of these terms will result in immediate link deactivation and account termination.
          </p>
        </section>

        <section className="bg-surface border border-hairline p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" /> 3. Service Availability
          </h2>
          <p>
            We strive to provide continuous uptime via caching and distributed infrastructure. However, LinkGuard is provided "as is" without implied guarantees of uninterrupted availability.
          </p>
        </section>
      </div>
    </div>
  );
}

export default TermsPage;
