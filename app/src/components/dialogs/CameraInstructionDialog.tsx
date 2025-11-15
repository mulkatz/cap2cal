import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../Dialog.tsx';
import { Card } from '../Card.group.tsx';
import { CTAButton } from '../buttons/CTAButton.tsx';
import { IconCamera3 } from '../../assets/icons';

interface CameraInstructionDialogProps {
  onClose: () => void;
}

export const CameraInstructionDialog = ({ onClose }: CameraInstructionDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog onClose={onClose} closeOnClickOutside={false}>
      <Card>
        <div className={'flex flex-col items-center px-3 pb-3 pt-6 text-center'}>
          <div className={'mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primaryElevated'}>
            <IconCamera3 width={40} height={40} className={'text-secondary'} />
          </div>
          <h2 className={'mb-5 text-[22px] font-semibold text-secondary opacity-90'}>
            {t('dialogs.onboarding.cameraInstruction.title')}
          </h2>
          <p className={'mb-4 px-4 text-[14px] font-medium leading-relaxed text-secondary opacity-70'}>
            {t('dialogs.onboarding.cameraInstruction.description1')}
          </p>
          <p className={'mb-6 px-4 text-[14px] font-medium text-secondary opacity-70'}>
            {t('dialogs.onboarding.cameraInstruction.description2')}
          </p>
        </div>
        <CTAButton text={t('dialogs.onboarding.cameraInstruction.button')} onClick={onClose} highlight />
      </Card>
    </Dialog>
  );
};
