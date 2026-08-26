import React from 'react';
import { Shield, FileText, CheckCircle, AlertTriangle, Scale } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 lg:py-24 space-y-10">
      <div className="space-y-3 text-center sm:text-left border-b border-hairline pb-8">
        <div className="flex items-center gap-2 text-accent text-xs font-mono font-bold uppercase tracking-widest">
          <Scale className="w-4 h-4" /> Legal & Terms of Service
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-text-primary tracking-tight">
          Terms of Service & Usage Policy
        </h1>
        <p className="text-sm text-text-secondary">Effective Date: August 2026 | Version 2.1</p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-text-secondary leading-relaxed">
        <section className="bg-surface border border-hairline p-6 sm:p-8 rounded-2xl space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" /> 1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using LinkGuard Platform Inc. ("LinkGuard", "Service"), available at <code className="text-emerald-400 font-mono">https://link-guard-two.vercel.app</code> or through our REST API endpoints, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service.
          </p>
        </section>

        <section className="bg-surface border border-hairline p-6 sm:p-8 rounded-2xl space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-accent" /> 2. Acceptable Use & Prohibited Content
          </h2>
          <p>LinkGuard provides short link management for legitimate personal, enterprise, and developer use cases. Users are strictly prohibited from utilizing LinkGuard to shorten, redirect, or distribute:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Phishing websites, credential harvesting pages, or malware downloads.</li>
            <li>Unsolicited bulk email (SPAM) or illegal marketing campaigns.</li>
            <li>Content that violates intellectual property or copyright laws.</li>
            <li>Automated abuse designed to disrupt service availability.</li>
          </ul>
          <p className="pt-2 text-text-primary font-semibold">
            Violation of acceptable use policies will result in immediate link termination and permanent account suspension.
          </p>
        </section>

        <section className="bg-surface border border-hairline p-6 sm:p-8 rounded-2xl space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent" /> 3. Service Level Agreement & Availability
          </h2>
          <p>
            LinkGuard strives to maintain 99.9% uptime across our global routing infrastructure. Short link redirection is backed by a Redis in-memory cache layer to deliver sub-10ms lookup speeds. While we endeavor to maintain uninterrupted availability, LinkGuard is provided on an "as is" and "as available" basis.
          </p>
        </section>

        <section className="bg-surface border border-hairline p-6 sm:p-8 rounded-2xl space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-accent" /> 4. Account Security & API Keys
          </h2>
          <p>
            Registered users are responsible for maintaining the confidentiality of their account authentication tokens and API credentials. You agree to notify <code className="text-text-primary font-mono">support@linkguard.app</code> immediately upon discovering unauthorized access to your workspace.
          </p>
        </section>
      </div>
    </div>
  );
}

export default TermsPage;
