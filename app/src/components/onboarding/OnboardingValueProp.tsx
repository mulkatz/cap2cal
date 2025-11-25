import React from 'react';
import { Camera } from 'lucide-react';

export const OnboardingValueProp: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6">
      {/* Content Container */}
      <div className="flex w-full max-w-md flex-col items-center">
        {/* Hero Visual - Large Camera Icon in Glowing Yellow Circle */}
        <div className="mb-12 flex items-center justify-center">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-highlight/30 to-highlight/10 shadow-2xl shadow-highlight/20 ring-4 ring-highlight/30">
            <Camera className="h-16 w-16 text-highlight" strokeWidth={2} />
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-highlight/10 blur-xl" />
          </div>
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
