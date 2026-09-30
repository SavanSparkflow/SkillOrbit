import React from 'react';

const Badge = ({ children, variant = 'indigo', className = '' }) => {
  const styles = {
    indigo: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border tracking-wide select-none ${
        styles[variant] || styles.indigo
      } ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
