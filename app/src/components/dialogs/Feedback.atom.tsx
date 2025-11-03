import { CTAButton } from '../buttons/CTAButton.tsx';
import { ToggleItem } from './ToggleItem.atom.tsx';
import { useRef, useState } from 'react';
import { useFirebaseContext } from '../../contexts/FirebaseContext.tsx';
import { cn, getPlatformAndBrowser } from '../../utils.ts';
import { useAppContext } from '../../contexts/AppContext.tsx';
import toast from 'react-hot-toast';
import { useDialogContext } from '../../contexts/DialogContext.tsx';
import { useTranslation } from 'react-i18next';
import { colors } from '../../design-tokens/colors.ts';

type Kind = 'default' | 'idea' | 'bug';

export const Feedback = ({}: {}) => {
  const { t } = useTranslation();
  const dialogs = useDialogContext();
  const { sendFeedback } = useFirebaseContext();
  const { version } = useAppContext();
  const [kind, setKind] = useState<Kind>('default');
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

      toast(t('toasts.feedback.success'), {
        style: {
          borderColor: colors.accent,
          backgroundColor: colors.primary,
          color: colors.secondary,
        },
        duration: 2500,
      });

      dialogs.pop();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  return (
    <>
      <div className={'mb-2 flex w-full flex-col gap-2.5 px-3 text-center text-secondary'}>
        <div className={'text-[22px] font-semibold opacity-90'}>{t('dialogs.feedback.title')}</div>
        <div className={'mb-1 px-4 text-[14px] font-medium opacity-70'}>{t('dialogs.feedback.description')}</div>
        <div className={'flex w-full gap-2'}>
          <ToggleItem
            text={t('dialogs.feedback.idea')}
            isHighlight={kind === 'idea'}
            highlightColor={colors.ideaHighlight}
            onClick={() => onToggle('idea')}
          />
          <ToggleItem
            text={t('dialogs.feedback.bug')}
            isHighlight={kind === 'bug'}
            highlightColor={colors.bugHighlight}
            onClick={() => onToggle('bug')}
          />
        </div>
        <textarea
          ref={textRef}
          className={
            'w-full rounded-md border border-gray-300 bg-primaryElevated px-3 py-2 text-[16px] focus:outline-none focus:ring-2 focus:ring-indigo-500'
          }
          rows={5}
          placeholder={t('dialogs.feedback.inputPlaceholder')}
        />
      </div>
      <div className={cn('h-[1px] w-full bg-accent')}></div>
      <CTAButton text={t('dialogs.feedback.send')} onClick={handleSubmit} />
    </>
  );
};
