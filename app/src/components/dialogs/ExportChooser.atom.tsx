import { CTAButton } from '../buttons/CTAButton.tsx';
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
    <>
      <div className={'mb-3 flex w-full flex-col items-center justify-center gap-5 px-3 pt-[13px] text-center'}>
        <div className={'text-[22px] font-semibold opacity-90'}>{t('dialogs.export.title')}</div>
        <div className={'flex flex-col gap-4'}>
          {onApple && <Entry icon={<IconAppleCalendar />} text={'Apple Calendar'} onClick={onApple} />}
          {onGoogle && <Entry icon={<IconGoogleCalendar />} text={'Google Calendar'} onClick={onGoogle} />}
          {onOutlook && <Entry icon={<IconOutlookCalendar />} text={'Microsoft Outlook'} onClick={onOutlook} />}
        </div>
      </div>
      <CTAButton text={t('general.cancel')} onClick={onClose} />
    </>
  );
};

const Entry = ({ icon, text, onClick }: { icon: ReactNode; text: string; onClick: () => void }) => (
  <div
    className={cn(
      'flex items-center gap-3',
      'transform rounded-md border-[1px] border-highlight/0 p-1.5 transition-all duration-[100ms] active:border-highlight/100'
    )}
    onClick={onClick}>
    {icon}
    <p className={'text-[15px] font-normal'}>{text}</p>
  </div>
);
