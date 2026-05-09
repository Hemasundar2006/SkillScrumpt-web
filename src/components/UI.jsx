import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ className, variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-lg shadow-secondary/20',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-primary hover:bg-primary/10',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20',
  };

  return (
    <button
      className={twMerge(
        'inline-flex items-center justify-center rounded-custom px-6 py-2.5 text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
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
        'bg-white border border-border rounded-custom p-6 shadow-sm overflow-hidden',
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
        'bg-white/70 backdrop-blur-md border border-white/20 rounded-custom shadow-xl',
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
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <span
      className={twMerge(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
