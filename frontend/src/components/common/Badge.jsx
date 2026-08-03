import React from 'react';

export function Badge({ children, variant = 'active' }) {
  const variants = {
    active:   'bg-accent/10 text-accent border-accent/20',
    disabled: 'bg-text-tertiary/10 text-text-tertiary border-text-tertiary/20',
    expired:  'bg-danger/10 text-danger border-danger/20',
    warning:  'bg-warning/10 text-warning border-warning/20',
    info:     'bg-info/10 text-info border-info/20',
    admin:    'bg-accent/10 text-accent border-accent/20',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border uppercase tracking-wider ${variants[variant] || variants.active}`}>
      {children}
    </span>
  );
}

export default Badge;
