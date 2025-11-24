import React from 'react';

export const FullPageLoader: React.FC<{ message?: string }> = ({ message }) => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
    <div className="relative w-24 h-24">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-200 rounded-full animate-ping"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-600 rounded-full animate-spin border-t-transparent"></div>
    </div>
    {message && <p className="mt-6 text-lg font-medium text-slate-700 animate-pulse">{message}</p>}
  </div>
);