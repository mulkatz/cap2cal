import { useDialogContext } from '../../contexts/DialogContext.tsx';
import { useFirebaseContext } from '../../contexts/FirebaseContext.tsx';
import { useTranslation } from 'react-i18next';
import { AnalyticsEvent } from '../../utils/analytics.ts';
import { cn } from '../../utils.ts';
import { Star } from 'lucide-react';

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

  return (
    <div className="flex w-full flex-col items-center">
      {/* Three Stars in Arc */}
      <div className="relative mt-8 flex h-20 w-32 items-center justify-center">
        {/* Left star - rotated left */}
        <div
          className="absolute left-0 top-4"
          style={{
            transform: 'rotate(-15deg)',
            filter: 'drop-shadow(0 0 8px rgba(230, 222, 77, 0.6))',
          }}>
          <Star className="h-8 w-8 fill-highlight text-highlight" />
        </div>
        {/* Center star - larger, slightly higher */}
        <div
          className="absolute left-1/2 top-0"
          style={{
            transform: 'translateX(-50%)',
            filter: 'drop-shadow(0 0 10px rgba(230, 222, 77, 0.7))',
          }}>
          <Star className="h-10 w-10 fill-highlight text-highlight" />
        </div>
        {/* Right star - rotated right */}
        <div
          className="absolute right-0 top-4"
          style={{
            transform: 'rotate(15deg)',
            filter: 'drop-shadow(0 0 8px rgba(230, 222, 77, 0.6))',
          }}>
          <Star className="h-8 w-8 fill-highlight text-highlight" />
        </div>
      </div>

      {/* Title */}
      <div className="w-full px-6 pb-2 text-center">
        <h2 className="text-xl font-bold text-white">{t('dialogs.appLikePrompt.title')}</h2>
      </div>

      {/* Description */}
      <div className="w-full px-6 pb-6 text-center">
        <p className="text-sm text-gray-300">{t('dialogs.appLikePrompt.description')}</p>
      </div>

      {/* Action Buttons - Vertical Stack */}
      <div className="flex w-full flex-col gap-3 px-6 pb-6">
        {/* Primary Button - YES */}
        <button
          onClick={handleLike}
          className={cn(
            'w-full rounded-full bg-highlight px-6 py-3',
            'text-base font-bold text-primaryDark',
            'transition-all duration-200 active:scale-95',
            'shadow-md hover:shadow-lg hover:shadow-highlight/20'
          )}>
          {t('dialogs.appLikePrompt.yes')}
        </button>

        {/* Secondary Button - FEEDBACK */}
        <button
          onClick={handleDislike}
          className={cn(
            'w-full rounded-full bg-white/5 px-6 py-3',
            'text-base font-medium text-white',
            'transition-all duration-200 active:scale-95',
            'hover:bg-white/10'
          )}>
          {t('dialogs.appLikePrompt.notReally')}
        </button>
      </div>
    </div>
  );
};
