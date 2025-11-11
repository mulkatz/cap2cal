import React from 'react';
import { useTranslation } from 'react-i18next';
import iconImage from '../../assets/images/icon.png';

export const OnboardingValueProp: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6 py-12">
      {/* Main Card Container */}
      <div className="w-full max-w-md rounded-2xl border-2 border-accentElevated bg-primaryDark p-8 shadow-2xl">
        {/* App Logo */}
        <div className="mb-6 flex items-center justify-center">
          <div className="rounded-3xl bg-gradient-to-br from-highlight/20 to-highlight/5 p-2 ring-2 ring-highlight/30">
            <img src={iconImage} alt="Cap2Cal Logo" className="h-20 w-20 rounded-2xl" />
          </div>
        </div>

        {/* Hero Visualization */}
        <div className="mb-8 flex w-full items-center justify-center">
          <div className="relative flex items-center justify-center gap-3">
            {/* Camera Icon */}
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 border-accentElevated bg-primary shadow-md">
              <svg
                className="h-7 w-7 text-secondary"
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

            {/* Arrow with glow */}
            <div className="relative">
              <svg
                className="h-8 w-8 flex-shrink-0 text-highlight drop-shadow-lg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>

            {/* Calendar Icon */}
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 border-accentElevated bg-primary shadow-md">
              <svg className="h-7 w-7 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-3 text-center text-3xl font-bold leading-tight text-secondary">
          {t('dialogs.onboarding.valueProp.title')}
        </h1>

        {/* Subtitle */}
        <p className="text-center text-base leading-relaxed text-secondary/70">
          {t('dialogs.onboarding.valueProp.subtitle')}
        </p>

        {/* Decorative gradient bar */}
        <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-highlight/50 to-highlight"></div>
      </div>
    </div>
  );
};
