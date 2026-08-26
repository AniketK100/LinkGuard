import React, { useState } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const plans = [
  {
    name: 'Starter',
    price: '0',
    desc: 'Ideal for individuals and developer side-projects.',
    features: [
      '50 active short links',
      'Sub-10ms Redis redirect speed',
      'Basic click telemetry analytics',
      'Vector SVG & PNG QR code generator',
      'Community support access'
    ]
  },
  {
    name: 'Pro',
    price: '19',
    desc: 'Designed for creators, professionals, and growing teams.',
    popular: true,
    features: [
      'Unlimited active short links',
      'Custom branded alias slugs',
      'BCrypt password protected links',
      'Real-time geographic & device analytics',
      'High-resolution vector QR exports',
      'Priority 24/7 technical support'
    ]
  },
  {
    name: 'Enterprise',
    price: '99',
    desc: 'Built for enterprise organizations requiring dedicated infrastructure.',
    features: [
      'Custom domain configuration',
      'Multi-user RBAC & team management',
      '99.9% Uptime SLA guarantee',
      'Security audit log history',
      'Dedicated engineering support'
    ]
  },
];

export function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24 space-y-14">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-bold">
          <ShieldCheck className="w-3.5 h-3.5" /> Transparent Pricing
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-text-primary tracking-tight">
          Simple, Transparent Link Infrastructure Pricing
        </h1>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          No hidden bandwidth fees or per-click surcharges. Choose the plan that fits your link management volume.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 pt-2 text-sm">
          <span className={`font-semibold ${!annual ? 'text-text-primary' : 'text-text-tertiary'}`}>Monthly Billing</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${annual ? 'bg-accent' : 'bg-hairline'}`}
            aria-label="Toggle Annual Billing"
          >
            <div className={`absolute top-1 w-4 h-4 bg-canvas rounded-full transition-transform duration-200 ease-out-expo ${annual ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className={`font-semibold ${annual ? 'text-text-primary' : 'text-text-tertiary'}`}>
            Annual Billing <span className="text-accent text-xs font-mono font-bold">−20% OFF</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`bg-surface border rounded-2xl p-7 flex flex-col justify-between relative shadow-lg ${plan.popular ? 'border-accent/40 ring-1 ring-accent/20' : 'border-hairline'}`}>
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-canvas text-[11px] font-mono font-bold rounded-full uppercase tracking-wider shadow-sm">
                Most Popular
              </span>
            )}
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-text-primary">{plan.name}</h2>
                <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">{plan.desc}</p>
              </div>
              <div className="flex items-baseline gap-1.5 py-1">
                <span className="text-4xl font-mono font-extrabold text-text-primary tracking-tight">
                  ${annual ? Math.round(Number(plan.price) * 0.8) : plan.price}
                </span>
                <span className="text-text-tertiary text-xs sm:text-sm font-medium">/ month</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-8">
              <Link to="/register" className="block">
                <Button variant={plan.popular ? 'primary' : 'secondary'} className="w-full justify-center py-3">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PricingPage;
