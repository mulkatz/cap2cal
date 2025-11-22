import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../Dialog.tsx';
import { IconCamera3 } from '../../assets/icons';
import { cn } from '../../utils.ts';

interface CameraInstructionDialogProps {
  onClose: () => void;
}

export const CameraInstructionDialog = ({ onClose }: CameraInstructionDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog onClose={onClose} closeOnClickOutside={false}>
      <div className={'flex flex-col items-center px-6 pb-6 pt-8 text-center'}>
        {/* Icon */}
        <div className={'mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primaryDark'}>
          <IconCamera3 width={40} height={40} className={'text-highlight'} />
        </div>

        {/* Title */}
        <h2 className={'mb-5 font-["Plus_Jakarta_Sans"] text-xl font-bold text-white'}>
          {t('dialogs.onboarding.cameraInstruction.title')}
        </h2>

        {/* Body Text */}
        <p className={'mb-4 px-2 font-["Plus_Jakarta_Sans"] text-sm leading-relaxed text-gray-300'}>
          {t('dialogs.onboarding.cameraInstruction.description1')}
        </p>
        <p className={'mb-6 px-2 font-["Plus_Jakarta_Sans"] text-sm text-gray-300'}>
          {t('dialogs.onboarding.cameraInstruction.description2')}
        </p>

        {/* Primary Action Button */}
        <button
          onClick={onClose}
          className={cn(
            'w-full rounded-2xl bg-highlight px-6 py-4',
            'font-["Plus_Jakarta_Sans"] text-base font-bold text-primaryDark',
            'transition-all active:scale-95'
          )}>
          {t('dialogs.onboarding.cameraInstruction.button')}
        </button>
      </div>
    </Dialog>
  );
};
