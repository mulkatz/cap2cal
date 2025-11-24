import { useTranslation } from 'react-i18next';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { PremiumConfirm } from '../modals/PremiumModal';

export const PermissionDeniedAtom = ({
  type,
  onClose,
}: {
  type: 'camera' | 'calendar' | 'photos';
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  const openAppSettings = async () => {
    await NativeSettings.open({
      optionAndroid: AndroidSettings.ApplicationDetails,
      optionIOS: IOSSettings.App,
    });
  };

  const getMessage = () => {
    if (type === 'camera') return t('dialogs.permissionDenied.cameraAdvice');
    if (type === 'calendar') return t('dialogs.permissionDenied.calendarAdvice');
    return t('dialogs.permissionDenied.photosAdvice');
  };

  return (
    <PremiumConfirm
      title={t('dialogs.permissionDenied.title')}
      message={getMessage()}
      confirmText={t('dialogs.permissionDenied.toSettings')}
      cancelText={t('general.cancel')}
      onConfirm={openAppSettings}
      onClose={onClose}
    />
  );
};
