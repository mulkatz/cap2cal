import React from 'react';
import { useTranslation } from 'react-i18next';
import { CTAButton } from '../buttons/CTAButton.tsx';

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
      {/* Progress Indicators */}
      <div className="mb-6 flex justify-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === step
                ? 'w-8 bg-highlight'
                : index < step
                  ? 'w-2 bg-highlight opacity-50'
                  : 'w-2 bg-accentElevated opacity-40'
            }`}
          />
        ))}
      </div>

      {/* Next/Get Started Button */}
      <CTAButton
        text={
          isLastStep ? t('dialogs.onboarding.navigation.getStarted') : t('dialogs.onboarding.navigation.next')
        }
        onClick={onNext}
        highlight
        data-testid="onboarding-next-button"
      />
    </div>
  );
};
