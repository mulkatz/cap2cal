import React from 'react';
import { useTranslation } from 'react-i18next';

export const OnboardingGetStarted: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6 py-12">
      {/* Main Card Container */}
      <div className="w-full max-w-md rounded-2xl border-2 border-accentElevated bg-primaryDark p-8 shadow-2xl">
        {/* Icon */}
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-highlight/30 to-highlight/10 ring-4 ring-highlight/20 shadow-lg shadow-highlight/30">
            <svg className="h-10 w-10 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-3 text-center text-3xl font-bold text-secondary">
          {t('dialogs.onboarding.getStarted.title')}
        </h2>

        {/* Subtitle */}
        <p className="mb-8 text-center text-base leading-relaxed text-secondary/70">
          {t('dialogs.onboarding.getStarted.subtitle')}
        </p>

        {/* Benefits */}
        <div className="mb-8 flex w-full flex-col gap-4">
          <div className="flex items-center gap-3 rounded-lg border-2 border-accentElevated bg-primary/50 p-3 text-left">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-md">
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-base font-semibold text-secondary">{t('dialogs.onboarding.getStarted.bullet1')}</p>
          </div>

          <div className="flex items-center gap-3 rounded-lg border-2 border-accentElevated bg-primary/50 p-3 text-left">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-md">
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-base font-semibold text-secondary">{t('dialogs.onboarding.getStarted.bullet2')}</p>
          </div>

          <div className="flex items-center gap-3 rounded-lg border-2 border-accentElevated bg-primary/50 p-3 text-left">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-md">
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-base font-semibold text-secondary">{t('dialogs.onboarding.getStarted.bullet3')}</p>
          </div>
        </div>

        {/* Permissions Explanation */}
        <div className="rounded-xl border-2 border-accentElevated/50 bg-primaryElevated/50 p-5">
          <p className="mb-4 text-center text-sm font-bold uppercase tracking-wide text-highlight">
            {t('dialogs.onboarding.getStarted.permissionsTitle')}
          </p>
          <div className="flex flex-col gap-3 text-left">
            <div className="flex items-start gap-3 rounded-lg bg-primary/30 p-3">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-highlight"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
              </svg>
              <p className="text-sm font-medium leading-tight text-secondary">
                {t('dialogs.onboarding.getStarted.permissionCamera')}
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-primary/30 p-3">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-highlight"
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
              <p className="text-sm font-medium leading-tight text-secondary">
                {t('dialogs.onboarding.getStarted.permissionCalendar')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
