import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ className, variant = 'primary', ...props }) {
  const variants = {
    primary: 'btn-premium text-[11px] px-8 py-4',
    secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:border-white/30 backdrop-blur-md uppercase tracking-widest text-[11px] font-bold rounded-full shadow-lg shadow-black/50',
    outline: 'border border-white/20 text-white hover:border-white/50 hover:bg-white/5 uppercase tracking-widest text-[11px] font-bold rounded-full backdrop-blur-sm',
    ghost: 'text-white/60 hover:text-white hover:bg-white/5 uppercase tracking-widest text-[11px] font-bold rounded-full',
    danger: 'bg-red-500/20 text-red-200 hover:bg-red-500/30 border border-red-500/30 uppercase tracking-widest text-[11px] font-bold rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.2)]',
  };

  return (
    <button
      className={twMerge(
        'inline-flex items-center justify-center transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none hover-scale',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, children, ...props }) {
  return (
    <div
      className={twMerge(
        'glass-card p-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassContainer({ className, children, ...props }) {
  return (
    <div
      className={twMerge(
        'glass-panel rounded-[2rem] shadow-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({ className, variant = 'primary', children, ...props }) {
  const variants = {
    primary: 'bg-blue-500/20 text-blue-200 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
    success: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    warning: 'bg-amber-500/20 text-amber-200 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    error: 'bg-red-500/20 text-red-200 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
    neutral: 'bg-white/10 text-white/70 border-white/10 backdrop-blur-md',
  };

  return (
    <span
      className={twMerge(
        'inline-flex items-center rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border backdrop-blur-sm',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
