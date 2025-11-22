import { ExtractionError } from '../../api/model.ts';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils.ts';

export const NotCaptured = ({ reason, onClose }: { reason: ExtractionError; onClose?: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col">
      {/* Title & Message */}
      <div className="flex w-full flex-col gap-5 px-6 pb-4 pt-8 text-center">
        <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-white">
          {t('dialogs.notCaptured.title')}
        </h2>
        <div className="font-['Plus_Jakarta_Sans'] text-base font-bold tracking-wide text-warn">
          {t(`types.extractErrorReason.${reason}`)}
        </div>
        <p className="px-2 font-['Plus_Jakarta_Sans'] text-sm text-gray-300">
          {t('dialogs.notCaptured.generalAdvice')}
        </p>
      </div>

      {/* Button */}
      <div className="flex w-full flex-col gap-3 px-6 pb-6">
        <button
          onClick={onClose}
          className={cn(
            'w-full rounded-2xl bg-highlight px-6 py-4',
            'font-["Plus_Jakarta_Sans"] text-base font-bold text-primaryDark',
            'transition-all active:scale-95'
          )}>
          {t('general.okay')}
        </button>
      </div>
    </div>
  );
};
