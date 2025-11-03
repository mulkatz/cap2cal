import { CTAButton } from '../buttons/CTAButton.tsx';
import { useTranslation } from 'react-i18next';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';

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

  return (
    <div>
      <div className={'mb-6 flex flex-col gap-5 px-3 text-center'}>
        <div className={'text-[22px] font-semibold opacity-90'}>{t('dialogs.permissionDenied.title')}</div>
        <div className={'px-4 text-[14px] font-medium opacity-70'}>
          {type === 'camera' && t('dialogs.permissionDenied.cameraAdvice')}
          {type === 'calendar' && t('dialogs.permissionDenied.calendarAdvice')}
          {type === 'photos' && t('dialogs.permissionDenied.photosAdvice')}
        </div>
      </div>
      <CTAButton text={t('dialogs.permissionDenied.toSettings')} onClick={openAppSettings} />
      <CTAButton text={t('general.cancel')} onClick={onClose} />
    </div>
  );
};
