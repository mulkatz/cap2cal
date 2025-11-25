import React from 'react';
import { useTranslation } from 'react-i18next';

interface OnboardingNavigationProps {
  step: number;
  totalSteps: number;
  onNext: () => void;
}

export const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({ step, totalSteps, onNext }) => {
  const { t } = useTranslation();

  const isLastStep = step === totalSteps - 1;

  return (
    <div className="w-full px-6">
      {/* High-Voltage Pagination Dots */}
      <div className="mb-6 flex justify-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === step
                ? 'w-8 bg-[#E6DE4D]' // Active: Electric Yellow
                : 'w-2 bg-[#2C4156]'  // Inactive: Navy
            }`}
          />
        ))}
      </div>

      {/* Glass & Neon Button with 3D Depth */}
      <button
        onClick={onNext}
        data-testid="onboarding-next-button"
        className="h-14 w-full rounded-full border-b-4 border-[#C4BD42] bg-[#E6DE4D] font-bold uppercase tracking-wide text-[#1E2E3F] shadow-[0_4px_14px_0_rgba(230,222,77,0.4)] transition-all active:translate-y-1 active:border-b-2 active:shadow-[0_2px_8px_0_rgba(230,222,77,0.3)]"
      >
        {isLastStep ? t('dialogs.onboarding.navigation.getStarted') : t('dialogs.onboarding.navigation.next')}
      </button>
    </div>
  );
};
