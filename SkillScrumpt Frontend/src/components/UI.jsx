import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ className, variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-white text-black hover:bg-white/90 border border-white uppercase tracking-widest text-[10px] font-black',
    secondary: 'bg-black text-white hover:bg-white hover:text-black border border-white/20 hover:border-white uppercase tracking-widest text-[10px] font-black',
    outline: 'border border-white/20 text-white hover:border-white hover:bg-white hover:text-black uppercase tracking-widest text-[10px] font-black',
    ghost: 'text-white/50 hover:text-white uppercase tracking-widest text-[10px] font-black',
    danger: 'bg-white text-black hover:bg-white/90 border border-white uppercase tracking-widest text-[10px] font-black',
  };

  return (
    <button
      className={twMerge(
        'inline-flex items-center justify-center rounded-none px-8 py-3.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
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
        'bg-white/5 border border-white/10 rounded-none p-8 overflow-hidden',
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
        'bg-white/5 backdrop-blur-xl border border-white/10 rounded-none shadow-2xl',
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
    primary: 'bg-white/10 text-white border-white/20',
    success: 'bg-white/20 text-white border-white/40',
    warning: 'bg-white/10 text-white border-white/10',
    error: 'bg-white/10 text-white border-white/10',
    neutral: 'bg-white/5 text-white/50 border-white/5',
  };

  return (
    <span
      className={twMerge(
        'inline-flex items-center rounded-none px-3 py-1 text-[9px] font-black uppercase tracking-widest border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
