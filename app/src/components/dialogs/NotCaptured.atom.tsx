import { ExtractionError } from '../../api/model.ts';
import { useTranslation } from 'react-i18next';
import { PremiumAlert } from '../modals/PremiumModal';

export const NotCaptured = ({ reason, onClose }: { reason: ExtractionError; onClose?: () => void }) => {
  const { t } = useTranslation();
  return (
    <PremiumAlert
      title={t('dialogs.notCaptured.title')}
      message={
        <div className="flex flex-col gap-3">
          <div className="text-base font-bold tracking-wide text-warn">{t(`types.extractErrorReason.${reason}`)}</div>
          <p className="text-sm text-gray-300">{t('dialogs.notCaptured.generalAdvice')}</p>
        </div>
      }
      confirmText={t('general.okay')}
      onConfirm={() => {}}
      onClose={onClose}
    />
  );
};
