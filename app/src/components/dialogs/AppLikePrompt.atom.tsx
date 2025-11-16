import { useDialogContext } from '../../contexts/DialogContext.tsx';
import { useFirebaseContext } from '../../contexts/FirebaseContext.tsx';
import { useTranslation } from 'react-i18next';
import { AnalyticsEvent } from '../../utils/analytics.ts';
import { cn } from '../../utils.ts';

interface AppLikePromptProps {
  onLike: () => void;
  onDislike: () => void;
}

export const AppLikePrompt = ({ onLike, onDislike }: AppLikePromptProps) => {
  const { t } = useTranslation();
  const dialogs = useDialogContext();
  const { logAnalyticsEvent } = useFirebaseContext();

  const handleLike = () => {
    logAnalyticsEvent(AnalyticsEvent.REVIEW_PROMPT_LIKED);
    dialogs.pop();
    onLike();
  };

  const handleDislike = () => {
    logAnalyticsEvent(AnalyticsEvent.REVIEW_PROMPT_DISLIKED);
    dialogs.pop();
    onDislike();
  };

  const handleDismiss = () => {
    logAnalyticsEvent(AnalyticsEvent.REVIEW_PROMPT_DISMISSED);
    dialogs.pop();
  };

  return (
    <>
      <div className={'mb-2 flex w-full flex-col gap-4 px-6 py-4 text-center text-secondary'}>
        <div className={'text-[22px] font-semibold opacity-90'}>
          {t('dialogs.appLikePrompt.title')}
        </div>
        <div className={'px-2 text-[15px] font-medium opacity-70'}>
          {t('dialogs.appLikePrompt.description')}
        </div>
      </div>

      <div className={cn('h-[1px] w-full bg-accent')}></div>

      {/* Buttons */}
      <div className={'flex w-full flex-col'}>
        {/* Yes button */}
        <button
          onClick={handleLike}
          className={
            'w-full border-b border-accent py-3.5 text-[17px] font-semibold text-accent transition-colors hover:bg-primaryElevated active:bg-primaryElevated'
          }
        >
          {t('dialogs.appLikePrompt.yes')}
        </button>

        {/* Not really button */}
        <button
          onClick={handleDislike}
          className={
            'w-full border-b border-accent py-3.5 text-[17px] font-medium text-secondary opacity-70 transition-colors hover:bg-primaryElevated active:bg-primaryElevated'
          }
        >
          {t('dialogs.appLikePrompt.notReally')}
        </button>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className={
            'w-full py-3.5 text-[17px] font-medium text-secondary opacity-50 transition-colors hover:bg-primaryElevated active:bg-primaryElevated'
          }
        >
          {t('dialogs.appLikePrompt.dismiss')}
        </button>
      </div>
    </>
  );
};
