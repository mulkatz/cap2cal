import React from 'react';
import { useTranslation } from 'react-i18next';

export const OnboardingGetStarted: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 max-w-md">
      {/* Title */}
      <h2 className="text-3xl font-bold text-secondary mb-8">
        {t('dialogs.onboarding.getStarted.title')}
      </h2>

      {/* Benefits */}
      <div className="flex flex-col gap-4 w-full mb-8">
        <div className="flex items-center gap-3 text-left">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-lg text-secondary">{t('dialogs.onboarding.getStarted.bullet1')}</p>
        </div>

        <div className="flex items-center gap-3 text-left">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-lg text-secondary">{t('dialogs.onboarding.getStarted.bullet2')}</p>
        </div>

        <div className="flex items-center gap-3 text-left">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-lg text-secondary">{t('dialogs.onboarding.getStarted.bullet3')}</p>
        </div>
      </div>

      {/* Permissions Explanation */}
      <div className="w-full p-4 rounded-lg bg-primaryElevated bg-opacity-50 border border-accent border-opacity-20">
        <p className="text-sm font-semibold text-secondary mb-3">
          {t('dialogs.onboarding.getStarted.permissionsTitle')}
        </p>
        <div className="flex flex-col gap-2 text-left">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
            </svg>
            <p className="text-sm text-secondary opacity-80">
              {t('dialogs.onboarding.getStarted.permissionCamera')}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-secondary opacity-80">
              {t('dialogs.onboarding.getStarted.permissionCalendar')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
