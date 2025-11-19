import { CTAButton } from '../buttons/CTAButton.tsx';
import { useDialogContext } from '../../contexts/DialogContext.tsx';
import { useFirebaseContext } from '../../contexts/FirebaseContext.tsx';
import { AnalyticsEvent } from '../../utils/analytics.ts';
import { useTranslation } from 'react-i18next';

export const PrivacyConsent = ({ onAccept }: { onAccept: () => void }) => {
  const dialogs = useDialogContext();
  const { logAnalyticsEvent } = useFirebaseContext();
  const { t } = useTranslation();

  const handleAccept = () => {
    // Mark consent as given
    localStorage.setItem('hasAcceptedPrivacy', 'true');
    localStorage.setItem('analyticsEnabled', 'true');

    // Log event (now that user has consented)
    logAnalyticsEvent(AnalyticsEvent.ONBOARDING_STARTED);

    // Call parent callback
    onAccept();

    // Close dialog
    dialogs.pop();
  };

  const handlePrivacyPolicy = () => {
    window.open('https://cap2cal.app/privacy', '_blank');
  };

  return (
    <>
      <div className={'mb-4 flex w-full flex-col gap-4 px-4 pt-4 text-center text-secondary'}>
        <div className={'text-[24px] font-bold opacity-90'}>{t('dialogs.privacyConsent.title')}</div>

        <div className={'px-2 text-[15px] leading-relaxed opacity-80'}>
          <p className="mb-3">{t('dialogs.privacyConsent.intro')}</p>

          <div className="space-y-2 text-left text-[14px]">
            <p>
              <strong>{t('dialogs.privacyConsent.imageProcessingTitle')}</strong>{' '}
              {t('dialogs.privacyConsent.imageProcessingDescription')}
            </p>

            <p>
              <strong>{t('dialogs.privacyConsent.analyticsTitle')}</strong>{' '}
              {t('dialogs.privacyConsent.analyticsDescription')}
            </p>

            <p>
              <strong>{t('dialogs.privacyConsent.yourRightsTitle')}</strong>{' '}
              {t('dialogs.privacyConsent.yourRightsDescription')}
            </p>
          </div>
        </div>

        <button onClick={handlePrivacyPolicy} className="text-[13px] text-highlight underline">
          {t('dialogs.privacyConsent.privacyPolicyLink')}
        </button>
      </div>

      <div className={'flex w-full flex-col gap-2'}>
        <CTAButton text={t('dialogs.privacyConsent.acceptButton')} onClick={handleAccept} highlight={true} />
      </div>
    </>
  );
};
