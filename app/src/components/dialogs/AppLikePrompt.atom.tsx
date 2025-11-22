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
    <div className="flex flex-col">
      {/* Title & Description */}
      <div className={'flex w-full flex-col gap-4 px-6 pb-4 pt-8 text-center'}>
        <h2 className={'font-["Plus_Jakarta_Sans"] text-xl font-bold text-white'}>
          {t('dialogs.appLikePrompt.title')}
        </h2>
        <p className={'px-2 font-["Plus_Jakarta_Sans"] text-sm text-gray-300'}>
          {t('dialogs.appLikePrompt.description')}
        </p>
      </div>

      {/* Buttons */}
      <div className={'flex w-full flex-col gap-3 px-6 pb-6'}>
        {/* Yes button - Primary */}
        <button
          onClick={handleLike}
          className={cn(
            'w-full rounded-2xl bg-highlight px-6 py-4',
            'font-["Plus_Jakarta_Sans"] text-base font-bold text-primaryDark',
            'transition-all active:scale-95'
          )}>
          {t('dialogs.appLikePrompt.yes')}
        </button>

        {/* Not really button - Secondary */}
        <button
          onClick={handleDislike}
          className={cn(
            'w-full py-3 text-center',
            'font-["Plus_Jakarta_Sans"] text-sm text-gray-400',
            'transition-opacity hover:text-gray-300'
          )}>
          {t('dialogs.appLikePrompt.notReally')}
        </button>

        {/* Dismiss button - Tertiary */}
        <button
          onClick={handleDismiss}
          className={cn(
            'w-full py-2 text-center',
            'font-["Plus_Jakarta_Sans"] text-xs text-gray-500',
            'transition-opacity hover:text-gray-400'
          )}>
          {t('dialogs.appLikePrompt.dismiss')}
        </button>
      </div>
    </div>
  );
};
