import React from 'react';
import { useTranslation } from 'react-i18next';
import { isSmallScreen } from '../../utils.ts';

export const OnboardingTickets: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6">
      {/* Scrollable Container */}
      <div className="flex max-h-[70vh] w-full max-w-md flex-col overflow-y-auto">
        {/* Main Card Container */}
        <div className="rounded-2xl border-2 border-accentElevated bg-primaryDark p-6 shadow-2xl sm:p-8">
          {/* Icon */}
          <div className="mb-4 flex items-center justify-center sm:mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-highlight/30 to-highlight/10 shadow-lg shadow-highlight/30 ring-4 ring-highlight/20 sm:h-20 sm:w-20">
              <svg
                className="h-8 w-8 text-highlight sm:h-10 sm:w-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="mb-2 text-center text-2xl font-bold text-secondary sm:mb-3 sm:text-3xl">
            {t('dialogs.onboarding.tickets.title')}
          </h2>

          {/* Subtitle */}
          <p className="mb-6 text-center text-sm leading-relaxed text-secondary/70 sm:mb-8 sm:text-base">
            {t('dialogs.onboarding.tickets.subtitle')}
          </p>

          {/* Features Container */}
          <div className="mb-4 space-y-3 rounded-xl border-2 border-accentElevated/50 bg-primary/30 p-4 sm:mb-6 sm:space-y-4 sm:p-5">
            {/* Feature 1 */}
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-md sm:h-6 sm:w-6">
                <svg className="h-3 w-3 text-white sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm leading-tight text-secondary sm:text-base">
                {t('dialogs.onboarding.tickets.feature1')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-md sm:h-6 sm:w-6">
                <svg className="h-3 w-3 text-white sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm leading-tight text-secondary sm:text-base">
                {t('dialogs.onboarding.tickets.feature2')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-md sm:h-6 sm:w-6">
                <svg className="h-3 w-3 text-white sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm leading-tight text-secondary sm:text-base">
                {t('dialogs.onboarding.tickets.feature3')}
              </p>
            </div>
          </div>

          {/*Example visual - ticket button mockup */}
          {!isSmallScreen && (
            <div className="rounded-xl border-2 border-highlight/30 bg-gradient-to-r from-highlight/10 to-highlight/5 p-3 shadow-lg shadow-highlight/10 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-highlight">
                    {t('dialogs.onboarding.tickets.exampleLabel')}
                  </p>
                  <p className="mt-1 truncate text-base font-bold text-secondary sm:text-lg">Summer Festival 2025</p>
                </div>
                <div className="flex-shrink-0 rounded-lg bg-highlight px-3 py-2 text-xs font-bold text-primaryDark shadow-md sm:px-4 sm:text-sm">
                  {t('dialogs.onboarding.tickets.buyButton')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
