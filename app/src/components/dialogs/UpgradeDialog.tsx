import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils.ts';
import { BenefitsList } from '../BenefitsList';

interface UpgradeDialogProps {
  onUpgrade: () => void;
  onClose: () => void;
}

export const UpgradeDialog: React.FC<UpgradeDialogProps> = ({ onUpgrade, onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center px-6 pb-6 pt-8" data-testid="upgrade-dialog">
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primaryDark">
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
      <h2 className="mb-2 text-center text-xl font-bold text-white">
        {t('dialogs.upgrade.title')}
      </h2>
      <p className="mb-8 text-center text-sm text-gray-300">
        {t('dialogs.upgrade.subtitle')}
      </p>

      {/* Benefits */}
      <BenefitsList
        className="mb-8 w-full"
        items={[
          { text: t('dialogs.upgrade.benefit1') },
          { text: t('dialogs.upgrade.benefit2') },
          { text: t('dialogs.upgrade.benefit3') },
        ]}
      />

      {/* Pricing */}
      <div className="mb-6 w-full rounded-2xl border border-white/10 bg-primaryDark/50 p-4 text-center">
        <p className="text-2xl font-bold text-highlight">{t('dialogs.upgrade.pricing')}</p>
      </div>

      {/* Buttons */}
      <div className="w-full space-y-3">
        {/* Primary Action Button */}
        <button
          onClick={onUpgrade}
          className={cn(
            'w-full rounded-2xl bg-highlight px-6 py-4',
            'text-base font-bold text-primaryDark',
            'transition-all active:scale-95'
          )}>
          {t('dialogs.upgrade.cta')}
        </button>

        {/* Secondary/Cancel Button */}
        <button
          onClick={onClose}
          className={cn(
            'w-full py-3 text-center',
            'text-sm text-gray-400',
            'transition-opacity hover:text-gray-300'
          )}>
          {t('dialogs.upgrade.notNow')}
        </button>
      </div>
    </div>
  );
};
