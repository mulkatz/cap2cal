import React from 'react';
import { useTranslation } from 'react-i18next';

export const OnboardingHowItWorks: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6">
      {/* Scrollable Container */}
      <div className="flex max-h-[70vh] w-full max-w-md flex-col overflow-y-auto">
        {/* Main Card Container */}
        <div className="rounded-2xl border-2 border-accentElevated bg-primaryDark p-6 shadow-2xl sm:p-8">
          {/* Title */}
          <h2 className="mb-6 text-center text-2xl font-bold text-secondary sm:mb-8 sm:text-3xl">
            {t('dialogs.onboarding.howItWorks.title')}
          </h2>

          {/* Steps Container */}
          <div className="flex w-full flex-col gap-4 sm:gap-5">
            {/* Step 1: Capture */}
            <div className="rounded-xl border-2 border-accentElevated bg-primary/50 p-3 transition-all duration-200 hover:border-highlight/30 sm:p-4">
              <div className="flex items-start gap-3 text-left sm:gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-highlight/20 to-highlight/5 ring-2 ring-highlight/30 sm:h-12 sm:w-12">
                  <svg
                    className="h-5 w-5 text-highlight sm:h-6 sm:w-6"
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
                  <h3 className="mb-1 text-lg font-bold text-secondary sm:text-xl">
                    1. {t('dialogs.onboarding.howItWorks.step1Title')}
                  </h3>
                  <p className="text-xs leading-relaxed text-secondary/70 sm:text-sm">
                    {t('dialogs.onboarding.howItWorks.step1Description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Extract */}
            <div className="rounded-xl border-2 border-accentElevated bg-primary/50 p-3 transition-all duration-200 hover:border-highlight/30 sm:p-4">
              <div className="flex items-start gap-3 text-left sm:gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-highlight/20 to-highlight/5 ring-2 ring-highlight/30 sm:h-12 sm:w-12">
                  <svg
                    className="h-5 w-5 text-highlight sm:h-6 sm:w-6"
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
                  <h3 className="mb-1 text-lg font-bold text-secondary sm:text-xl">
                    2. {t('dialogs.onboarding.howItWorks.step2Title')}
                  </h3>
                  <p className="text-xs leading-relaxed text-secondary/70 sm:text-sm">
                    {t('dialogs.onboarding.howItWorks.step2Description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Save */}
            <div className="rounded-xl border-2 border-accentElevated bg-primary/50 p-3 transition-all duration-200 hover:border-highlight/30 sm:p-4">
              <div className="flex items-start gap-3 text-left sm:gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-highlight/20 to-highlight/5 ring-2 ring-highlight/30 sm:h-12 sm:w-12">
                  <svg
                    className="h-5 w-5 text-highlight sm:h-6 sm:w-6"
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
                  <h3 className="mb-1 text-lg font-bold text-secondary sm:text-xl">
                    3. {t('dialogs.onboarding.howItWorks.step3Title')}
                  </h3>
                  <p className="text-xs leading-relaxed text-secondary/70 sm:text-sm">
                    {t('dialogs.onboarding.howItWorks.step3Description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
