import React from 'react';
import { Orbit } from 'lucide-react';

const Loading = ({ text = 'Loading...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <Orbit className="w-10 h-10 text-indigo-400 animate-spin" />
      </div>
      <p className="text-sm font-medium text-slate-400 animate-pulse">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
