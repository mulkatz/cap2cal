import React from 'react';
import slideImage from '../../assets/images/onboarding/slide-4.png';

export const OnboardingSlide4: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6">
      {/* Content Container */}
      <div className="flex w-full max-w-md flex-col items-center">
        {/* Image with massive shadow */}
        <div className="pointer-events-none relative mb-12 w-full select-none">
          <img
            src={slideImage}
            alt="Sync to Calendar"
            className="mx-auto w-[280px] rounded-[32px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)]"
          />
        </div>

        {/* Eyebrow */}
        <p className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-[#E6DE4D]">
          Sync to Calendar
        </p>

        {/* Title */}
        <h1 className="mb-4 text-center text-3xl font-bold leading-tight tracking-tight text-white">
          Works with all major apps
        </h1>

        {/* Body */}
        <p className="text-center text-base font-medium leading-relaxed text-gray-300">
          Export to Apple Calendar, Google Calendar, Outlook, and more with one tap.
        </p>
      </div>
    </div>
  );
};
