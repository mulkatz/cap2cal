import React from 'react';
import { useTranslation } from 'react-i18next';

export const OnboardingTickets: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6 py-12">
      {/* Main Card Container */}
      <div className="w-full max-w-md rounded-2xl border-2 border-accentElevated bg-primaryDark p-8 shadow-2xl">
        {/* Icon with animated glow */}
        <div className="mb-6 flex items-center justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-highlight/30 to-highlight/10 ring-4 ring-highlight/20 shadow-lg shadow-highlight/30">
            <svg className="h-10 w-10 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 animate-ping rounded-full bg-highlight/20 ring-2 ring-highlight/30"></div>
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-3 text-center text-3xl font-bold text-secondary">
          {t('dialogs.onboarding.tickets.title')}
        </h2>

        {/* Subtitle */}
        <p className="mb-8 text-center text-base leading-relaxed text-secondary/70">
          {t('dialogs.onboarding.tickets.subtitle')}
        </p>

        {/* Features Container */}
        <div className="mb-6 space-y-4 rounded-xl border-2 border-accentElevated/50 bg-primary/30 p-5">
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
            <p className="text-base leading-tight text-secondary">
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
            <p className="text-base leading-tight text-secondary">
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
            <p className="text-base leading-tight text-secondary">
              {t('dialogs.onboarding.tickets.feature3')}
            </p>
          </div>
        </div>

        {/* Example visual - ticket button mockup */}
        <div className="rounded-xl border-2 border-highlight/30 bg-gradient-to-r from-highlight/10 to-highlight/5 p-4 shadow-lg shadow-highlight/10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-highlight">
                {t('dialogs.onboarding.tickets.exampleLabel')}
              </p>
              <p className="mt-1 text-lg font-bold text-secondary">Summer Festival 2025</p>
            </div>
            <div className="rounded-lg bg-highlight px-4 py-2 text-sm font-bold text-primaryDark shadow-md">
              {t('dialogs.onboarding.tickets.buyButton')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
