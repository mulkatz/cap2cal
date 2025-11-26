import { useRef, useState } from 'react';
import { useFirebaseContext } from '../../contexts/FirebaseContext.tsx';
import { cn, getPlatformAndBrowser } from '../../utils.ts';
import { useAppContext } from '../../contexts/AppContext.tsx';
import toast from 'react-hot-toast';
import { useDialogContext } from '../../contexts/DialogContext.tsx';
import { useTranslation } from 'react-i18next';
import { AnalyticsEvent, AnalyticsParam } from '../../utils/analytics.ts';

type Kind = 'default' | 'idea' | 'bug';

export const Feedback = ({}: {}) => {
  const { t } = useTranslation();
  const dialogs = useDialogContext();
  const { sendFeedback, logAnalyticsEvent } = useFirebaseContext();
  const { version } = useAppContext();
  const [kind, setKind] = useState<Kind>('idea');
  const textRef = useRef<HTMLTextAreaElement | null>(null);

  const onToggle = (kind: Kind) => setKind(kind);

  const handleSubmit = async () => {
    const text = textRef.current?.value;
    if (!text) return;

    try {
      await sendFeedback({
        kind,
        text,
        date: new Date().getTime(),
        env: getPlatformAndBrowser(),
        version,
      });

      // Track feedback submission
      logAnalyticsEvent(AnalyticsEvent.FEEDBACK_SUBMITTED, {
        [AnalyticsParam.FEEDBACK_TYPE]: kind,
      });

      toast(t('toasts.feedback.success'), {
        style: {
          borderColor: '#2C4156',
          backgroundColor: '#1E2E3F',
          color: '#FDDCFF',
        },
        duration: 2500,
      });

      dialogs.pop();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  return (
    <div className="flex flex-col">
      {/* Title */}
      <div className="px-6 pb-4 pt-8 text-center">
        <h2 className="text-xl font-bold text-white">{t('dialogs.feedback.title')}</h2>
      </div>

      {/* Description */}
      <div className="px-6 pb-4 text-center">
        <p className="text-sm text-gray-300">{t('dialogs.feedback.description')}</p>
      </div>

      {/* Form Content */}
      <div className="flex w-full flex-col gap-4 px-6">
        {/* Sliding Segmented Control - Fixed Contrast */}
        <div className="flex gap-1 rounded-xl bg-[#1E2E3F] p-1">
          <button
            onClick={() => onToggle('idea')}
            className={cn(
              'flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all',
              kind === 'idea'
                ? 'bg-[#E6DE4D] text-[#1E2E3F] shadow-[0_2px_4px_0_rgba(0,0,0,0.2)]'
                : 'text-slate-400 hover:text-slate-300'
            )}>
            {t('dialogs.feedback.idea')}
          </button>
          <button
            onClick={() => onToggle('bug')}
            className={cn(
              'flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all',
              kind === 'bug'
                ? 'bg-[#E6DE4D] text-[#1E2E3F] shadow-[0_2px_4px_0_rgba(0,0,0,0.2)]'
                : 'text-slate-400 hover:text-slate-300'
            )}>
            {t('dialogs.feedback.bug')}
          </button>
        </div>

        {/* Textarea - Tactile Depth with Inset Shadow */}
        <textarea
          ref={textRef}
          className={cn(
            'w-full rounded-xl border border-white/5 bg-[#1E2E3F] px-4 py-3 shadow-inner',
            'text-base text-white placeholder-gray-500',
            'outline-none transition-all',
            'focus:border-highlight'
          )}
          rows={5}
          placeholder={t('dialogs.feedback.inputPlaceholder')}
        />
      </div>

      {/* Submit Button */}
      <div className="flex flex-col gap-3 px-6 pb-6 pt-4">
        <button
          onClick={handleSubmit}
          className={cn(
            'w-full rounded-2xl bg-highlight px-6 py-4',
            'text-base font-bold text-primaryDark',
            'transition-all active:scale-95'
          )}>
          {t('dialogs.feedback.send')}
        </button>
      </div>
    </div>
  );
};
