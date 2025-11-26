import React from 'react';
import { CalendarCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const OnboardingSlide2: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6">
      {/* Content Container */}
      <div className="flex w-full max-w-md flex-col items-center">
        {/* Icon with glow */}
        <div className="relative mb-12 flex items-center justify-center">
          {/* Glow effect behind */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="h-48 w-48 rounded-full bg-[#E6DE4D] opacity-20 blur-[80px]" />
          </div>

          {/* Icon container */}
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#2C4156]/40 shadow-[inset_0_0_20px_rgba(230,222,77,0.2),_0_0_25px_-5px_rgba(230,222,77,0.4)] ring-1 ring-[#E6DE4D]/50">
            <CalendarCheck className="h-16 w-16 text-[#E6DE4D]" strokeWidth={1.5} />
          </div>
        </div>

        {/* Eyebrow */}
        <p className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-[#E6DE4D]">
          {t('dialogs.onboarding.slide2.eyebrow')}
        </p>

        {/* Title */}
        <h1 className="mb-4 text-center text-3xl font-bold leading-tight tracking-tight text-white">
          {t('dialogs.onboarding.slide2.title')}
        </h1>

        {/* Body */}
        <p className="text-center text-base font-medium leading-relaxed text-gray-300">
          {t('dialogs.onboarding.slide2.body')}
        </p>
      </div>
    </div>
  );
};
