import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconCamera3 } from '../../assets/icons';
import { PremiumAlert } from '../modals/PremiumModal';

interface CameraInstructionDialogProps {
  onClose: () => void;
}

export const CameraInstructionDialog = ({ onClose }: CameraInstructionDialogProps) => {
  const { t } = useTranslation();

  return (
    <div data-testid="camera-instruction-dialog">
      <PremiumAlert
        title={t('dialogs.onboarding.cameraInstruction.title')}
        message={
          <div className="flex flex-col items-center gap-4" data-testid="camera-instruction-content">
            {/* Icon */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primaryDark">
              <IconCamera3 size={40} className="text-highlight" />
            </div>
            {/* Body Text */}
            <div className="flex flex-col gap-2 text-sm leading-relaxed text-gray-300">
              <p>{t('dialogs.onboarding.cameraInstruction.description1')}</p>
              <p>{t('dialogs.onboarding.cameraInstruction.description2')}</p>
            </div>
          </div>
        }
        confirmText={t('dialogs.onboarding.cameraInstruction.button')}
        onConfirm={() => {}}
        onClose={onClose}
      />
    </div>
  );
};
