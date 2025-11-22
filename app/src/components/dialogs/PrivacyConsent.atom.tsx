import { useDialogContext } from '../../contexts/DialogContext.tsx';
import { cn } from '../../utils.ts';
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
    <div className="flex flex-col">
      {/* Title & Content */}
      <div className={'flex w-full flex-col gap-4 px-6 pb-4 pt-8 text-center'}>
        <h2 className={'font-["Plus_Jakarta_Sans"] text-xl font-bold text-white'}>
          {t('dialogs.privacyConsent.title')}
        </h2>

        <div className={'px-2 font-["Plus_Jakarta_Sans"] text-sm leading-relaxed text-gray-300'}>
          <p className="mb-3">{t('dialogs.privacyConsent.intro')}</p>

          <div className="space-y-2 text-left text-[13px]">
            <p>
              <strong className="text-white">{t('dialogs.privacyConsent.imageProcessingTitle')}</strong>{' '}
              {t('dialogs.privacyConsent.imageProcessingDescription')}
            </p>

            <p>
              <strong className="text-white">{t('dialogs.privacyConsent.analyticsTitle')}</strong>{' '}
              {t('dialogs.privacyConsent.analyticsDescription')}
            </p>

            <p>
              <strong className="text-white">{t('dialogs.privacyConsent.yourRightsTitle')}</strong>{' '}
              {t('dialogs.privacyConsent.yourRightsDescription')}
            </p>
          </div>
        </div>

        <button
          onClick={handlePrivacyPolicy}
          className="font-['Plus_Jakarta_Sans'] text-[13px] text-highlight underline">
          {t('dialogs.privacyConsent.privacyPolicyLink')}
        </button>
      </div>

      {/* Accept Button */}
      <div className={'flex w-full flex-col gap-3 px-6 pb-6'}>
        <button
          onClick={handleAccept}
          className={cn(
            'w-full rounded-2xl bg-highlight px-6 py-4',
            'font-["Plus_Jakarta_Sans"] text-base font-bold text-primaryDark',
            'transition-all active:scale-95'
          )}>
          {t('dialogs.privacyConsent.acceptButton')}
        </button>
      </div>
    </div>
  );
};
