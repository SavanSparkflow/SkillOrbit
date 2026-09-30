import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Orbit } from 'lucide-react';

const Logo = ({ size = 'normal' }) => {
  return (
    <Link to="/" className="flex items-center gap-2.5 group select-none">
      <div className="relative flex items-center justify-center">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Logo Badge */}
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-[2px] shadow-lg">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Orbit className="w-5 h-5 text-indigo-400 group-hover:rotate-45 transition-transform duration-500" />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-indigo-600 dark:from-white dark:via-slate-100 dark:to-indigo-200 bg-clip-text text-transparent">
            Skill<span className="text-emerald-500 dark:text-emerald-400">Orbit</span>
          </span>
          <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded border border-indigo-500/20 dark:border-indigo-500/30">
            PRO
          </span>
        </div>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-1 tracking-wider uppercase font-medium">
          Next-Gen LMS
        </span>
      </div>
    </Link>
  );
};

export default Logo;
