import { ExtractionError } from '../../api/model.ts';
import { CTAButton } from '../buttons/CTAButton.tsx';
import { useTranslation } from 'react-i18next';

export const NotCaptured = ({ reason, onClose }: { reason: ExtractionError; onClose?: () => void }) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className={'mb-6 flex flex-col gap-5 px-3 text-center'}>
        <div className={'text-[22px] font-semibold opacity-90'}>{t('dialogs.notCaptured.title')}</div>
        <div className={'text-[16px] font-bold tracking-wider'}>{t(`types.extractErrorReason.${reason}`)}</div>
        <div className={'px-4 text-[14px] font-medium opacity-70'}>{t('dialogs.notCaptured.generalAdvice')}</div>
      </div>
      <CTAButton text={t('general.okay')} onClick={onClose} />
    </div>
  );
};
