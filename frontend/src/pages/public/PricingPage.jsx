import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const plans = [
  { name: 'Starter', price: '0', desc: 'For individuals starting out.', features: ['50 short links', 'Basic click analytics', 'Custom QR codes', 'Community support'] },
  { name: 'Pro', price: '19', desc: 'For creators and growing teams.', popular: true, features: ['Unlimited short links', 'Custom aliases', 'Password protection', 'Full click analytics', 'High-res QR export', 'Priority support'] },
  { name: 'Enterprise', price: '99', desc: 'For large teams and organizations.', features: ['Custom domains', 'Team login & roles', '99.9% uptime guarantee', 'Security & audit logs', '24/7 dedicated support'] },
];

export function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 py-20 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-text-primary tracking-tight">Simple Pricing</h1>
        <p className="text-text-secondary text-sm">Transparent pricing. No per-click fees or hidden costs.</p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 text-sm">
          <span className={`font-medium ${!annual ? 'text-text-primary' : 'text-text-tertiary'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${annual ? 'bg-accent' : 'bg-hairline'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 bg-canvas rounded-full transition-transform duration-200 ease-out-expo ${annual ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
          <span className={`font-medium ${annual ? 'text-text-primary' : 'text-text-tertiary'}`}>Annual <span className="text-accent text-xs font-mono">−20%</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.name} className={`bg-surface border rounded-xl p-6 flex flex-col justify-between relative ${plan.popular ? 'border-accent/30 ring-1 ring-accent/10' : 'border-hairline'}`}>
            {plan.popular && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-accent text-canvas text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">
                Popular
              </span>
            )}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-text-primary">{plan.name}</h3>
                <p className="text-xs text-text-tertiary mt-0.5">{plan.desc}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-mono font-extrabold text-text-primary tracking-tight">
                  ${annual ? Math.round(Number(plan.price) * 0.8) : plan.price}
                </span>
                <span className="text-text-tertiary text-xs">/mo</span>
              </div>
              <ul className="space-y-2 text-[13px] text-text-secondary">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6">
              <Link to="/register" className="block">
                <Button variant={plan.popular ? 'primary' : 'secondary'} className="w-full justify-center">
                  Get Started
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
