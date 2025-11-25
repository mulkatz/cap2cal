import React from 'react';
import { Camera } from 'lucide-react';

// GlowContainer - Reusable wrapper for High-Voltage glow effect
const GlowContainer: React.FC<{ children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }> = ({
  children,
  size = 'lg'
}) => {
  const sizeClasses = {
    sm: 'h-20 w-20',
    md: 'h-28 w-28',
    lg: 'h-32 w-32'
  };

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`relative flex ${sizeClasses[size]} items-center justify-center rounded-full bg-gradient-to-br from-[#E6DE4D]/30 to-[#E6DE4D]/10 shadow-[0_0_30px_-5px_rgba(230,222,77,0.6)] ring-1 ring-[#E6DE4D]/20`}
      >
        {children}
      </div>
    </div>
  );
};

export const OnboardingValueProp: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6">
      {/* Content Container */}
      <div className="flex w-full max-w-md flex-col items-center">
        {/* Hero Visual - Camera Icon with High-Voltage Glow */}
        <div className="mb-12">
          <GlowContainer>
            <Camera className="h-16 w-16 text-[#E6DE4D]" strokeWidth={2.5} />
          </GlowContainer>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-center text-3xl font-bold leading-tight text-white">
          Capture Everything
        </h1>

        {/* Body */}
        <p className="text-center text-lg font-medium leading-relaxed text-gray-300">
          Posters, flyers, handwritten notes—if it has a date, we can read it. Just snap a photo.
        </p>
      </div>
    </div>
  );
};
