import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Check } from 'lucide-react';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Contact Us</h1>
        <p className="text-slate-400 text-sm">Have a question or feedback? Reach out to our engineering team.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl shadow-xl">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full w-fit mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Message Sent!</h3>
            <p className="text-sm text-slate-400">Thank you for reaching out. We will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Name</label>
              <input type="text" required placeholder="Your full name" className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" required placeholder="you@example.com" className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Message</label>
              <textarea rows={4} required placeholder="How can we help you?" className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"></textarea>
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ContactPage;
