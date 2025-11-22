import React from 'react';
import { useTranslation } from 'react-i18next';
import { isSmallScreen } from '../../utils.ts';
import { cn } from '../../utils';

export const OnboardingGetStarted: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6">
      {/* Scrollable Container */}
      <div className="flex max-h-[70vh] w-full max-w-md flex-col overflow-y-auto">
        {/* Main Card Container */}
        <div className="rounded-2xl border-2 border-accentElevated bg-primaryDark p-6 shadow-2xl sm:p-8">
          {/* Icon */}
          {/*<div className="mb-4 flex items-center justify-center sm:mb-6">*/}
          {/*  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-highlight/30 to-highlight/10 shadow-lg shadow-highlight/30 ring-4 ring-highlight/20 sm:h-20 sm:w-20">*/}
          {/*    <svg*/}
          {/*      className="h-8 w-8 text-highlight sm:h-10 sm:w-10"*/}
          {/*      fill="none"*/}
          {/*      stroke="currentColor"*/}
          {/*      viewBox="0 0 24 24">*/}
          {/*      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />*/}
          {/*    </svg>*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/* Title */}
          <h2 className="mb-2 text-center text-2xl font-bold text-secondary sm:mb-3 sm:text-3xl">
            {t('dialogs.onboarding.getStarted.title')}
          </h2>

          {/* Subtitle */}
          <p className="mb-6 text-center text-sm leading-relaxed text-secondary/70 sm:mb-8 sm:text-base">
            {t('dialogs.onboarding.getStarted.subtitle')}
          </p>

          {/* Benefits */}
          <div className={cn('flex w-full flex-col gap-3 sm:mb-8 sm:gap-4', !isSmallScreen && 'mb-6')}>
            <div className="flex items-center gap-2 rounded-lg border-2 border-accentElevated bg-primary/50 p-2.5 text-left sm:gap-3 sm:p-3">
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-md sm:h-6 sm:w-6">
                <svg className="h-3 w-3 text-white sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-secondary sm:text-base">
                {t('dialogs.onboarding.getStarted.bullet1')}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg border-2 border-accentElevated bg-primary/50 p-2.5 text-left sm:gap-3 sm:p-3">
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-md sm:h-6 sm:w-6">
                <svg className="h-3 w-3 text-white sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-secondary sm:text-base">
                {t('dialogs.onboarding.getStarted.bullet2')}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg border-2 border-accentElevated bg-primary/50 p-2.5 text-left sm:gap-3 sm:p-3">
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-md sm:h-6 sm:w-6">
                <svg className="h-3 w-3 text-white sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-secondary sm:text-base">
                {t('dialogs.onboarding.getStarted.bullet3')}
              </p>
            </div>
          </div>

          {/* Permissions Explanation */}
          {!isSmallScreen && (
            <div className="rounded-xl border-2 border-accentElevated/50 bg-primaryElevated/50 p-4 sm:p-5">
              <p className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-highlight sm:mb-4 sm:text-sm">
                {t('dialogs.onboarding.getStarted.permissionsTitle')}
              </p>
              <div className="flex flex-col gap-2 text-left sm:gap-3">
                <div className="flex items-start gap-2 rounded-lg bg-primary/30 p-2.5 sm:gap-3 sm:p-3">
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-highlight sm:h-5 sm:w-5"
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
                  <p className="pt-1 text-xs font-medium leading-tight text-secondary sm:text-sm">
                    {t('dialogs.onboarding.getStarted.permissionCamera')}
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-primary/30 p-2.5 sm:gap-3 sm:p-3">
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-highlight sm:h-5 sm:w-5"
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
                  <p className="pt-1 text-xs font-medium leading-tight text-secondary sm:text-sm">
                    {t('dialogs.onboarding.getStarted.permissionCalendar')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
