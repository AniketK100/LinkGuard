import React, { useEffect, useRef } from 'react';

export function StatCard({ title, value, icon: Icon, change, trend = 'up', hero = false }) {
  const counterRef = useRef(null);

  useEffect(() => {
    if (counterRef.current && typeof value === 'number') {
      const el = counterRef.current;
      const end = value;
      const dur = 600;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * end).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, [value]);

  return (
    <div className={`bg-surface border border-hairline rounded-xl p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-100 hover:border-accent/30 w-full min-w-0 ${hero ? 'col-span-1 sm:col-span-2 row-span-1 sm:row-span-2 p-4 sm:p-6' : ''}`}>
      <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-text-tertiary truncate">{title}</span>
        {Icon && (
          <div className="p-1.5 rounded-lg bg-accent/5 border border-accent/10 text-accent flex-shrink-0">
            <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
          </div>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-2 flex-wrap">
        <span
          ref={counterRef}
          className={`font-mono font-bold tracking-tight text-text-primary truncate ${hero ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-2xl'}`}
        >
          {typeof value === 'number' ? '0' : value}
        </span>
        {change && (
          <span className={`text-[10px] sm:text-[11px] font-mono font-semibold flex-shrink-0 ${trend === 'up' ? 'text-accent' : 'text-danger'}`}>
            {trend === 'up' ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;
