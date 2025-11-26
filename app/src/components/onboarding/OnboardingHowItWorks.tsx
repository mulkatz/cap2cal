import React from 'react';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// GlowContainer - Reusable wrapper for High-Voltage glow effect
const GlowContainer: React.FC<{ children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }> = ({
  children,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-20 w-20',
    md: 'h-24 w-24',
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

export const OnboardingHowItWorks: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6">
      {/* Content Container */}
      <div className="flex w-full max-w-md flex-col items-center">
        {/* Hero Visual - AI Magic Flow: Sparkles -> Arrow -> Calendar */}
        <div className="mb-12 flex items-center justify-center gap-4">
          {/* Sparkles Icon with Glow */}
          <GlowContainer>
            <Sparkles className="h-12 w-12 text-[#E6DE4D]" strokeWidth={2.5} fill="currentColor" />
          </GlowContainer>

          {/* Animated Arrow */}
          <ArrowRight className="h-8 w-8 animate-pulse text-[#E6DE4D]" strokeWidth={3} />

          {/* Calendar Icon with Glow */}
          <GlowContainer>
            <Calendar className="h-12 w-12 text-[#E6DE4D]" strokeWidth={2.5} />
          </GlowContainer>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-center text-3xl font-bold leading-tight text-white">
          {t('dialogs.onboarding.howItWorks.title')}
        </h1>

        {/* Body */}
        <p className="text-center text-lg font-medium leading-relaxed text-gray-300">
          {t('dialogs.onboarding.howItWorks.subtitle')}
        </p>
      </div>
    </div>
  );
};
