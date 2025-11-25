import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';

export const OnboardingHowItWorks: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6">
      {/* Content Container */}
      <div className="flex w-full max-w-md flex-col items-center">
        {/* Hero Visual - Magic to Event Animation */}
        <div className="mb-12 flex items-center justify-center gap-6">
          {/* Sparkles Icon */}
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-highlight/30 to-highlight/10 shadow-xl shadow-highlight/20 ring-2 ring-highlight/30">
            <Sparkles className="h-12 w-12 text-highlight" strokeWidth={2} fill="currentColor" />
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-highlight/10 blur-lg" />
          </div>

          {/* Connecting Line */}
          <div className="relative flex items-center">
            <div className="h-1 w-12 bg-gradient-to-r from-highlight/60 to-highlight/30" />
            {/* Arrow */}
            <div className="absolute right-0 h-2 w-2 translate-x-1 rotate-45 border-r-2 border-t-2 border-highlight/60" />
          </div>

          {/* Calendar Icon */}
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-highlight/20 to-highlight/5 shadow-lg ring-2 ring-highlight/20">
            <Calendar className="h-12 w-12 text-highlight" strokeWidth={2} />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-center text-3xl font-bold leading-tight text-white">
          AI-Powered Details
        </h1>

        {/* Body */}
        <p className="text-center text-lg font-medium leading-relaxed text-gray-300">
          We automatically extract titles, dates, times, and locations. No more manual typing.
        </p>
      </div>
    </div>
  );
};
