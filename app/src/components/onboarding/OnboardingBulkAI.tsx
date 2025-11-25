import React from 'react';
import { FileText, Cpu } from 'lucide-react';

// ReactorNode - Glass & Neon Component
const ReactorNode: React.FC<{ children: React.ReactNode; size?: 'sm' | 'md' | 'lg'; opacity?: number }> = ({
  children,
  size = 'lg',
  opacity = 100,
}) => {
  const sizeClasses = {
    sm: 'h-20 w-20 p-4',
    md: 'h-28 w-28 p-6',
    lg: 'h-32 w-32 p-8',
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Glass Node */}
      <div
        className={`relative flex ${sizeClasses[size]} items-center justify-center rounded-full bg-[#2C4156]/40 shadow-[inset_0_0_20px_rgba(230,222,77,0.2),_0_0_25px_-5px_rgba(230,222,77,0.4)] ring-1 ring-[#E6DE4D]/50`}
        style={{ opacity: opacity / 100 }}>
        {children}
      </div>
    </div>
  );
};

export const OnboardingBulkAI: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6">
      {/* Content Container */}
      <div className="flex w-full max-w-md flex-col items-center">
        {/* SLIDE 2: THE STACK - Overlapping ReactorNodes */}
        <div className="relative mb-12 flex items-center justify-center">
          {/* Stage Light (Behind) */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="h-64 w-64 rounded-full bg-[#E6DE4D] opacity-10 blur-[100px]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-center text-3xl font-bold leading-tight tracking-tight text-white">
          Instant Bulk Intelligence
        </h1>

        {/* Body */}
        <p className="text-center text-lg font-medium leading-relaxed text-gray-300">
          Scan stacks of flyers at once. Our AI extracts every detail—dates, times, locations—in seconds.
        </p>
      </div>
    </div>
  );
};
