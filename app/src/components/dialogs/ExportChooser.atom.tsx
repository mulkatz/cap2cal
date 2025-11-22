import { IconAppleCalendar, IconGoogleCalendar, IconOutlookCalendar } from '../../assets/icons';
import { ReactNode } from 'react';
import { cn } from '../../utils.ts';
import { useTranslation } from 'react-i18next';

export const ExportChooser = ({
  onApple,
  onGoogle,
  onOutlook,
  onClose,
}: {
  onApple?: () => void;
  onGoogle?: () => void;
  onOutlook?: () => void;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col">
      {/* Title */}
      <div className="flex w-full flex-col gap-5 px-6 pb-4 pt-8 text-center">
        <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-white">
          {t('dialogs.export.title')}
        </h2>

        {/* Calendar Options */}
        <div className="flex flex-col gap-3">
          {onApple && <Entry icon={<IconAppleCalendar />} text={t('dialogs.export.appleCalendar')} onClick={onApple} />}
          {onGoogle && <Entry icon={<IconGoogleCalendar />} text={t('dialogs.export.googleCalendar')} onClick={onGoogle} />}
          {onOutlook && <Entry icon={<IconOutlookCalendar />} text={t('dialogs.export.microsoftOutlook')} onClick={onOutlook} />}
        </div>
      </div>

      {/* Cancel Button */}
      <div className="px-6 pb-6">
        <button
          onClick={onClose}
          className={cn(
            'w-full py-3 text-center',
            'font-["Plus_Jakarta_Sans"] text-sm text-gray-400',
            'transition-opacity hover:text-gray-300'
          )}>
          {t('general.cancel')}
        </button>
      </div>
    </div>
  );
};

const Entry = ({ icon, text, onClick }: { icon: ReactNode; text: string; onClick: () => void }) => (
  <button
    className={cn(
      'flex items-center gap-3 rounded-xl border border-white/10 bg-primaryDark px-4 py-3.5',
      'font-["Plus_Jakarta_Sans"] text-base text-white',
      'transition-all active:scale-95 active:border-highlight/50'
    )}
    onClick={onClick}>
    {icon}
    <span>{text}</span>
  </button>
);
