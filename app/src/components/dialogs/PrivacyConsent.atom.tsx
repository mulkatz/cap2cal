import { CTAButton } from '../buttons/CTAButton.tsx';
import { useDialogContext } from '../../contexts/DialogContext.tsx';
import { useFirebaseContext } from '../../contexts/FirebaseContext.tsx';
import { AnalyticsEvent } from '../../utils/analytics.ts';

export const PrivacyConsent = ({ onAccept }: { onAccept: () => void }) => {
  const dialogs = useDialogContext();
  const { logAnalyticsEvent } = useFirebaseContext();

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
        <div className={'text-[24px] font-bold opacity-90'}>Welcome to Cap2Cal</div>

        <div className={'px-2 text-[15px] leading-relaxed opacity-80'}>
          <p className="mb-3">
            We care about your privacy. Here's what you should know:
          </p>

          <div className="text-left space-y-2 text-[14px]">
            <p>
              <strong>📸 Image Processing:</strong> Photos you capture are sent to Google's Gemini AI
              to extract event information. Images are not stored on our servers.
            </p>

            <p>
              <strong>📊 Analytics:</strong> We collect anonymous usage data to improve the app.
              You can disable this anytime in Settings.
            </p>

            <p>
              <strong>🔒 Your Rights:</strong> You can export or delete all your data at any time
              from the Settings screen.
            </p>
          </div>
        </div>

        <button
          onClick={handlePrivacyPolicy}
          className="text-[13px] text-highlight underline">
          Read full Privacy Policy
        </button>
      </div>

      <div className={'flex w-full flex-col gap-2'}>
        <CTAButton text="Accept & Continue" onClick={handleAccept} highlight={true} />
      </div>
    </>
  );
};
