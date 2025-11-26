import React from 'react';
import { useTranslation } from 'react-i18next';

// ReactorNode - Glass & Neon Component
const ReactorNode: React.FC<{ children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }> = ({ children, size = 'lg' }) => {
  const sizeClasses = {
    sm: 'h-20 w-20 p-4',
    md: 'h-28 w-28 p-6',
    lg: 'h-36 w-36 p-8',
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Glass Node */}
      <div
        className={`relative flex ${sizeClasses[size]} items-center justify-center rounded-full bg-[#2C4156]/40 shadow-[inset_0_0_20px_rgba(230,222,77,0.2),_0_0_25px_-5px_rgba(230,222,77,0.4)] ring-1 ring-[#E6DE4D]/50`}>
        {children}
      </div>
    </div>
  );
};

export const OnboardingShareExtension: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6">
      {/* Content Container */}
      <div className="flex w-full max-w-md flex-col items-center">
        {/* SLIDE 3: THE FLOW - Horizontal Chain with Connected ReactorNodes */}
        <div className="relative mb-12 flex items-center justify-center">
          {/* Stage Light (Behind) */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="h-64 w-64 rounded-full bg-[#E6DE4D] opacity-10 blur-[100px]" />
          </div>

          {/* Chain: Left -> Middle -> Right */}
          <div className="flex items-center gap-6">{/* Left: Small ReactorNode with ImageIcon */}</div>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-center text-3xl font-bold leading-tight tracking-tight text-white">
          {t('dialogs.onboarding.shareExtension.title')}
        </h1>

        {/* Body */}
        <p className="text-center text-lg font-medium leading-relaxed text-gray-300">
          {t('dialogs.onboarding.shareExtension.subtitle')}
        </p>
      </div>
    </div>
  );
};
