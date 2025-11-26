import React from 'react';
import { useTranslation } from 'react-i18next';

export const OnboardingFreeTrial: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex max-w-md flex-col items-center justify-center px-6 text-center">
      {/* Title */}
      <h2 className="mb-8 text-3xl font-bold text-secondary">{t('dialogs.onboarding.freeTrial.title')}</h2>

      {/* Benefits */}
      <div className="mb-8 flex w-full flex-col gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-lg text-secondary">{t('dialogs.onboarding.freeTrial.bullet1')}</p>
        </div>

        <div className="flex items-center gap-3 text-left">
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-lg text-secondary">{t('dialogs.onboarding.freeTrial.bullet2')}</p>
        </div>

        <div className="flex items-center gap-3 text-left">
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-lg text-secondary">{t('dialogs.onboarding.freeTrial.bullet3')}</p>
        </div>
      </div>

      {/* Permissions Explanation */}
      <div className="w-full rounded-lg border border-accent border-opacity-20 bg-primaryElevated bg-opacity-50 p-4">
        <p className="mb-3 text-sm font-semibold text-secondary">
          {t('dialogs.onboarding.freeTrial.permissionsTitle')}
        </p>
        <div className="flex flex-col gap-2 text-left">
          <div className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
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
            <p className="text-sm text-secondary opacity-80">{t('dialogs.onboarding.freeTrial.permissionCamera')}</p>
          </div>
          <div className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
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
            <p className="text-sm text-secondary opacity-80">{t('dialogs.onboarding.freeTrial.permissionCalendar')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
