import React from 'react';
import { useTranslation } from 'react-i18next';

export const OnboardingHowItWorks: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-8 py-12">
      {/* Title */}
      <h2 className="mb-12 text-center text-3xl font-bold text-secondary">
        {t('dialogs.onboarding.howItWorks.title')}
      </h2>

      {/* Steps */}
      <div className="flex w-full max-w-sm flex-col gap-8">
        {/* Step 1: Capture */}
        <div className="flex items-start gap-4 text-left">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-secondary mb-1">
              1. {t('dialogs.onboarding.howItWorks.step1Title')}
            </h3>
            <p className="text-secondary opacity-70">
              {t('dialogs.onboarding.howItWorks.step1Description')}
            </p>
          </div>
        </div>

        {/* Step 2: Extract */}
        <div className="flex items-start gap-4 text-left">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-secondary mb-1">
              2. {t('dialogs.onboarding.howItWorks.step2Title')}
            </h3>
            <p className="text-secondary opacity-70">
              {t('dialogs.onboarding.howItWorks.step2Description')}
            </p>
          </div>
        </div>

        {/* Step 3: Save */}
        <div className="flex items-start gap-4 text-left">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-secondary mb-1">
              3. {t('dialogs.onboarding.howItWorks.step3Title')}
            </h3>
            <p className="text-secondary opacity-70">
              {t('dialogs.onboarding.howItWorks.step3Description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
