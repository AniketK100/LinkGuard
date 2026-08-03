import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PricingPage() {
  const plans = [
    { name: 'Starter', price: '$0', desc: 'Free forever for personal links', features: ['Up to 50 Short Links', 'Basic Click Analytics', 'Standard QR Codes', 'Community Support'] },
    { name: 'Pro', price: '$19', desc: 'Ideal for creators and growing teams', popular: true, features: ['Unlimited Short Links', 'Custom Aliases', 'Password Protection', 'Real-Time Analytics', 'High-Res QR Code Export', 'Priority Support'] },
    { name: 'Enterprise', price: '$99', desc: 'Dedicated infrastructure & SLAs', features: ['Custom Domain Integration', 'SSO & SAML Auth', 'Dedicated Redis Cluster', '99.99% SLA Uptime', 'Audit Log Retention', '24/7 Dedicated Support'] },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Flexible Pricing Plans</h1>
        <p className="text-slate-400 text-base">Simple, transparent pricing for individuals and businesses of any scale.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div key={idx} className={`bg-slate-900/80 border p-8 rounded-2xl flex flex-col justify-between relative ${plan.popular ? 'border-emerald-500 shadow-xl shadow-emerald-500/10' : 'border-slate-800'}`}>
            {plan.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-bold rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            )}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{plan.desc}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                <span className="text-slate-400 text-sm">/month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                {plan.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/register" className={`mt-8 w-full py-3 rounded-xl text-center text-sm font-semibold transition-all ${plan.popular ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:from-emerald-400 hover:to-cyan-400' : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'}`}>
              Get Started
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PricingPage;
