import React from 'react';
import { ExtractionError } from '../../../models/api.types.ts';
import { useTranslation } from 'react-i18next';
import { cn } from '../../../utils.ts';

export const ErrorResultContent = ({ reason, onClose }: { reason: ExtractionError; onClose?: () => void }) => {
  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 flex items-center justify-center px-6">
      <div
        className={cn(
          'relative w-full max-w-md overflow-hidden rounded-3xl bg-primaryElevated shadow-2xl',
          'border border-white/5'
        )}>
        <div className="flex flex-col">
          {/* Title */}
          <h2 className="px-6 pt-6 text-center text-xl font-bold text-white">{t('dialogs.notCaptured.title')}</h2>

          {/* Message/Content */}
          <div className="px-6 py-4 text-center text-sm text-gray-300">
            <div className="flex flex-col gap-3">
              <div className="text-base font-bold tracking-wide text-warn">
                {t(`types.extractErrorReason.${reason}`)}
              </div>
              <p className="text-sm text-gray-300">{t('dialogs.notCaptured.generalAdvice')}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 px-6 pb-6 pt-2">
            <button
              onClick={onClose}
              className={cn(
                'w-full rounded-2xl bg-highlight px-6 py-4',
                'text-base font-bold text-primaryDark',
                'transition-all active:scale-95'
              )}>
              {t('general.okay')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
