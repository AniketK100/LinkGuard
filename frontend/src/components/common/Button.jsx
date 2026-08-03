import React from 'react';

export function Button({ children, variant = 'primary', size = 'md', className = '', disabled = false, onClick, type = 'button', icon: Icon, ...props }) {
  const base = "inline-flex items-center justify-center font-extrabold uppercase tracking-wider rounded-full transition-all duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary:   "bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 shadow-md",
    secondary: "bg-white border border-slate-300 text-slate-900 hover:bg-slate-50 dark:bg-[#18181B] dark:border-[#27272A] dark:text-white dark:hover:bg-[#27272A] shadow-sm font-semibold",
    ghost:     "bg-transparent text-text-primary hover:bg-surface-2 border border-transparent",
    danger:    "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-[11px] gap-1.5",
    md: "px-5 py-2 text-xs gap-2",
    lg: "px-7 py-3 text-xs sm:text-sm gap-2.5",
  };

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />}
      {children && <span>{children}</span>}
    </button>
  );
}

export default Button;
