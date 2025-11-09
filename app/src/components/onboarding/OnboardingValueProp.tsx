import React from 'react';
import { useTranslation } from 'react-i18next';

export const OnboardingValueProp: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center px-4">
      {/* Hero Image Placeholder */}
      <div className="w-64 h-64 mb-8 flex items-center justify-center">
        <div className="relative">
          {/* Camera Icon */}
          <svg
            className="w-32 h-32 text-primary opacity-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>

          {/* Arrow */}
          <svg
            className="absolute top-1/2 -right-16 w-12 h-12 text-primary opacity-70 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>

          {/* Calendar Icon */}
          <svg
            className="absolute top-1/2 -right-32 w-24 h-24 text-primary opacity-90 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-secondary mb-4 leading-tight max-w-md">
        {t('dialogs.onboarding.valueProp.title')}
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-secondary opacity-70 max-w-sm">
        {t('dialogs.onboarding.valueProp.subtitle')}
      </p>
    </div>
  );
};
