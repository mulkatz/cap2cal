import React from 'react';
import { useTranslation } from 'react-i18next';
import { CTAButton } from '../buttons/CTAButton.tsx';

interface UpgradeDialogProps {
  onUpgrade: () => void;
  onClose: () => void;
}

export const UpgradeDialog: React.FC<UpgradeDialogProps> = ({ onUpgrade, onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center px-6 py-8">
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary bg-opacity-30">
        <svg
          className="h-10 w-10 text-highlight"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>

      {/* Title & Subtitle */}
      <h2 className="mb-2 text-center text-2xl font-bold text-secondary">
        {t('dialogs.upgrade.title')}
      </h2>
      <p className="mb-8 text-center text-sm text-secondary opacity-70">
        {t('dialogs.upgrade.subtitle')}
      </p>

      {/* Benefits */}
      <div className="mb-8 w-full space-y-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-base text-secondary">{t('dialogs.upgrade.benefit1')}</p>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-base text-secondary">{t('dialogs.upgrade.benefit2')}</p>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-base text-secondary">{t('dialogs.upgrade.benefit3')}</p>
        </div>
      </div>

      {/* Pricing */}
      <div className="mb-6 w-full rounded-lg border border-accent border-opacity-30 bg-primaryElevated bg-opacity-50 p-4 text-center">
        <p className="text-2xl font-bold text-highlight">{t('dialogs.upgrade.pricing')}</p>
      </div>

      {/* Buttons */}
      <div className="w-full space-y-3">
        <CTAButton text={t('dialogs.upgrade.cta')} onClick={onUpgrade} />
        <button
          onClick={onClose}
          className="w-full py-3 text-center text-sm text-secondary opacity-60 transition-opacity hover:opacity-100">
          {t('dialogs.upgrade.notNow')}
        </button>
      </div>
    </div>
  );
};
