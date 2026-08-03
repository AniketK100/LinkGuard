import React, { useState } from 'react';
import { Send, Mail, MessageSquare } from 'lucide-react';
import Button from '../../components/common/Button';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-text-primary tracking-tight">Get in Touch</h1>
        <p className="text-text-secondary text-sm">Engineering support, enterprise inquiries, or general feedback.</p>
      </div>

      {submitted ? (
        <div className="bg-surface border border-accent/20 rounded-xl p-8 text-center space-y-3 animate-fade-in">
          <div className="p-3 rounded-lg bg-accent/5 border border-accent/10 text-accent w-fit mx-auto">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-text-primary">Message received</h2>
          <p className="text-sm text-text-secondary">We typically respond within 24 hours. Check your inbox for a confirmation.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-surface border border-hairline rounded-xl p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">Name</label>
              <input type="text" required className="w-full px-3 py-2 bg-canvas border border-hairline rounded-lg text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent/40 transition-colors duration-100" placeholder="Your name" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">Email</label>
              <input type="email" required className="w-full px-3 py-2 bg-canvas border border-hairline rounded-lg text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent/40 transition-colors duration-100" placeholder="you@company.com" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-text-tertiary">Message</label>
            <textarea rows={5} required className="w-full px-3 py-2 bg-canvas border border-hairline rounded-lg text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent/40 resize-none transition-colors duration-100" placeholder="Describe your use case or question…" />
          </div>
          <Button type="submit" icon={Send}>Send Message</Button>
        </form>
      )}
    </div>
  );
}

export default ContactPage;
