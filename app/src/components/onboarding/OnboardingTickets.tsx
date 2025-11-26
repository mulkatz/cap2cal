import React from 'react';
import { useTranslation } from 'react-i18next';
import { isSmallScreen } from '../../utils.ts';

export const OnboardingTickets: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6">
      {/* Content Container */}
      <div className="flex w-full max-w-md flex-col">
        {/* Icon */}
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-highlight/30 to-highlight/10 shadow-lg shadow-highlight/30 ring-4 ring-highlight/20">
            <svg
              className="h-10 w-10 text-highlight"
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
        <h2 className="mb-4 text-center text-3xl font-bold text-white">
          {t('dialogs.onboarding.tickets.title')}
        </h2>

        {/* Subtitle */}
        <p className="mb-8 text-center text-lg font-medium leading-relaxed text-gray-300">
          {t('dialogs.onboarding.tickets.subtitle')}
        </p>

        {/* Features Container */}
        <div className="mb-8 flex flex-col gap-4">
          {/* Feature 1 */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-md">
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-base font-medium leading-tight text-gray-300">
              {t('dialogs.onboarding.tickets.feature1')}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-md">
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-base font-medium leading-tight text-gray-300">
              {t('dialogs.onboarding.tickets.feature2')}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-md">
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-base font-medium leading-tight text-gray-300">
              {t('dialogs.onboarding.tickets.feature3')}
            </p>
          </div>
        </div>

        {/*Example visual - ticket button mockup */}
        {!isSmallScreen && (
          <div className="mt-4 rounded-xl bg-gradient-to-r from-highlight/10 to-highlight/5 p-4 shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-highlight">
                  {t('dialogs.onboarding.tickets.exampleLabel')}
                </p>
                <p className="mt-1 truncate text-lg font-bold text-white">
                  {t('dialogs.onboarding.tickets.exampleEventName')}
                </p>
              </div>
              <div className="flex-shrink-0 rounded-lg bg-highlight px-4 py-2 text-sm font-bold text-primaryDark shadow-md">
                {t('dialogs.onboarding.tickets.buyButton')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
