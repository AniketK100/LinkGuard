import React, { useState } from 'react';
import { Send, Mail, MessageSquare, Shield, Clock, MapPin, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 lg:py-24 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-bold">
          <MessageSquare className="w-3.5 h-3.5" /> Direct Support & Inquiries
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-text-primary tracking-tight">
          Get in Touch with LinkGuard Team
        </h1>
        <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
          Have questions regarding API integrations, enterprise bandwidth limits, custom domain setups, or security disclosures? Our engineering and support team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-surface border border-hairline p-5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-wider">
              <Mail className="w-4 h-4" /> Technical Support
            </div>
            <p className="text-xs text-text-primary font-mono font-semibold">support@linkguard.app</p>
            <p className="text-[11px] text-text-secondary">24/7 ticket response for active subscribers.</p>
          </div>

          <div className="bg-surface border border-hairline p-5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4" /> Security Disclosures
            </div>
            <p className="text-xs text-text-primary font-mono font-semibold">security@linkguard.app</p>
            <p className="text-[11px] text-text-secondary">Direct SLA for vulnerability audit reports.</p>
          </div>

          <div className="bg-surface border border-hairline p-5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4" /> Service SLA
            </div>
            <p className="text-xs text-text-primary font-semibold">99.9% Uptime Guarantee</p>
            <p className="text-[11px] text-text-secondary">Sub-10ms Redis memory resolution.</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          {submitted ? (
            <div className="bg-surface border border-accent/20 rounded-2xl p-8 text-center space-y-4 animate-fade-in shadow-xl">
              <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-accent w-fit mx-auto">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-text-primary">Message Successfully Received</h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Thank you for contacting LinkGuard Platform Inc. An engineering specialist will review your request and respond via email within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-surface border border-hairline rounded-2xl p-6 sm:p-8 space-y-5 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-text-tertiary">Your Full Name</label>
                  <input type="text" required className="w-full px-3.5 py-2.5 bg-canvas border border-hairline rounded-xl text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent/40 transition-colors" placeholder="Jane Doe" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-text-tertiary">Email Address</label>
                  <input type="email" required className="w-full px-3.5 py-2.5 bg-canvas border border-hairline rounded-xl text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent/40 transition-colors" placeholder="jane@company.com" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-text-tertiary">Inquiry Category</label>
                <select className="w-full px-3.5 py-2.5 bg-canvas border border-hairline rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent/40 transition-colors">
                  <option>General Platform Inquiry</option>
                  <option>Developer & API Integration</option>
                  <option>Enterprise Custom Domain</option>
                  <option>Security & Vulnerability Report</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-text-tertiary">Detailed Message</label>
                <textarea rows={5} required className="w-full px-3.5 py-2.5 bg-canvas border border-hairline rounded-xl text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent/40 resize-none transition-colors" placeholder="Describe your use case, technical question, or feedback in detail…" />
              </div>

              <Button type="submit" icon={Send} className="w-full justify-center py-3">Send Support Message</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
