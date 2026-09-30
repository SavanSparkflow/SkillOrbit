import React from 'react';

const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`w-full bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
            Icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30'
              : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-rose-400 mt-0.5">{error}</span>}
    </div>
  );
};

export default Input;
