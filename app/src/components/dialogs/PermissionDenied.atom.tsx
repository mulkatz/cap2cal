import { useTranslation } from 'react-i18next';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { cn } from '../../utils.ts';

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
    <div className="flex flex-col">
      {/* Title & Message */}
      <div className="flex w-full flex-col gap-4 px-6 pb-4 pt-8 text-center">
        <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-white">
          {t('dialogs.permissionDenied.title')}
        </h2>
        <p className="px-2 font-['Plus_Jakarta_Sans'] text-sm text-gray-300">
          {type === 'camera' && t('dialogs.permissionDenied.cameraAdvice')}
          {type === 'calendar' && t('dialogs.permissionDenied.calendarAdvice')}
          {type === 'photos' && t('dialogs.permissionDenied.photosAdvice')}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex w-full flex-col gap-3 px-6 pb-6">
        <button
          onClick={openAppSettings}
          className={cn(
            'w-full rounded-2xl bg-highlight px-6 py-4',
            'font-["Plus_Jakarta_Sans"] text-base font-bold text-primaryDark',
            'transition-all active:scale-95'
          )}>
          {t('dialogs.permissionDenied.toSettings')}
        </button>

        <button
          onClick={onClose}
          className={cn(
            'w-full py-3 text-center',
            'font-["Plus_Jakarta_Sans"] text-sm text-gray-400',
            'transition-opacity hover:text-gray-300'
          )}>
          {t('general.cancel')}
        </button>
      </div>
    </div>
  );
};
