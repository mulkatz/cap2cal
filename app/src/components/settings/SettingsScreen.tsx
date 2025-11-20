import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../contexts/AppContext';
import { useDialogContext } from '../../contexts/DialogContext';
import { useFirebaseContext } from '../../contexts/FirebaseContext';
import { SettingSection, SettingItem, SettingToggle, SettingDivider } from './SettingItem';
import { IconChevronLeft } from '../../assets/icons';
import { Feedback } from '../dialogs/Feedback.atom';
import { Dialog } from '../Dialog';
import { Card } from '../Card.group';
import { exportUserData, clearLocalStorage, deleteAllUserData } from '../../utils/dataManagement';
import toast from 'react-hot-toast';
import { AnalyticsEvent } from '../../utils/analytics';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export const SettingsScreen = ({ onClose }: { onClose: () => void }) => {
  const { t, i18n } = useTranslation();
  const { version } = useAppContext();
  const dialogs = useDialogContext();
  const { logAnalyticsEvent } = useFirebaseContext();

  // Get current settings from localStorage
  const [vibrationEnabled, setVibrationEnabled] = useState(
    () => localStorage.getItem('vibrationEnabled') !== 'false'
  );
  const [analyticsEnabled, setAnalyticsEnabled] = useState(
    () => localStorage.getItem('analyticsEnabled') !== 'false'
  );
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(
    () => (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system'
  );

  const handleVibrationToggle = async (enabled: boolean) => {
    setVibrationEnabled(enabled);
    localStorage.setItem('vibrationEnabled', enabled.toString());

    // Test vibration
    if (enabled && Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }

    logAnalyticsEvent(AnalyticsEvent.SETTINGS_CHANGED, {
      setting: 'vibration',
      value: enabled,
    });
  };

  const handleAnalyticsToggle = (enabled: boolean) => {
    setAnalyticsEnabled(enabled);
    localStorage.setItem('analyticsEnabled', enabled.toString());

    // Log this event (even if user is disabling analytics)
    logAnalyticsEvent(AnalyticsEvent.SETTINGS_CHANGED, {
      setting: 'analytics',
      value: enabled,
    });

    toast.success(enabled ? t('toasts.settings.analyticsEnabled') : t('toasts.settings.analyticsDisabled'));
  };

  const handleLanguageChange = async () => {
    // Toggle between English and German for now
    const currentLang = i18n.language.startsWith('en') ? 'en-GB' : 'de-DE';
    const newLang = currentLang === 'en-GB' ? 'de-DE' : 'en-GB';

    await i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);

    logAnalyticsEvent(AnalyticsEvent.SETTINGS_CHANGED, {
      setting: 'language',
      value: newLang,
    });

    toast.success(t('toasts.settings.languageChanged'));
  };

  const handleThemeChange = () => {
    // Cycle through themes
    const themes: Array<'light' | 'dark' | 'system'> = ['system', 'light', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const newTheme = themes[(currentIndex + 1) % themes.length];

    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    logAnalyticsEvent(AnalyticsEvent.SETTINGS_CHANGED, {
      setting: 'theme',
      value: newTheme,
    });

    // TODO: Implement theme switching in the app
    toast(t('toasts.settings.themeSoon'));
  };

  const handleExportData = async () => {
    try {
      await exportUserData();
      logAnalyticsEvent(AnalyticsEvent.DATA_EXPORTED);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleClearStorage = async () => {
    // Show confirmation dialog
    if (
      !window.confirm(
        `${t('dialogs.settings.confirmClearStorage')}\n\n${t('dialogs.settings.confirmClearStorageMessage')}`
      )
    ) {
      return;
    }

    try {
      await clearLocalStorage();
      logAnalyticsEvent(AnalyticsEvent.STORAGE_CLEARED);
    } catch (error) {
      console.error('Clear storage failed:', error);
    }
  };

  const handleDeleteAccount = async () => {
    // Show confirmation dialog
    if (
      !window.confirm(
        `${t('dialogs.settings.confirmDeleteAccount')}\n\n${t('dialogs.settings.confirmDeleteAccountMessage')}`
      )
    ) {
      return;
    }

    try {
      await deleteAllUserData();
      logAnalyticsEvent(AnalyticsEvent.ACCOUNT_DELETED);

      // Close settings and reload app
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Delete account failed:', error);
    }
  };

  const handleFeedback = () => {
    logAnalyticsEvent(AnalyticsEvent.FEEDBACK_OPENED);

    dialogs.push(
      <Dialog
        onClose={() => {
          dialogs.pop();
        }}>
        <Card>
          <Feedback />
        </Card>
      </Dialog>
    );
  };

  const handlePrivacyPolicy = () => {
    window.open('https://cap2cal.app/privacy', '_blank');
  };

  const handleTerms = () => {
    window.open('https://cap2cal.app/terms', '_blank');
  };

  const handleWebsite = () => {
    window.open('https://cap2cal.app', '_blank');
  };

  const handleInviteFriends = () => {
    // Smart download link with platform detection
    // iOS users → Auto-redirect to App Store
    // Android users → Auto-redirect to Play Store
    // Desktop users → Show both options
    const shareLink = 'https://cap2cal.app/download';

    // Use native share if available
    if (navigator.share) {
      navigator.share({
        title: 'Cap2Cal - AI Event Capture',
        text: 'Check out Cap2Cal! Turn any event poster into a calendar entry with AI.',
        url: shareLink,
      }).then(() => {
        logAnalyticsEvent(AnalyticsEvent.EVENT_SHARED, {
          share_method: 'invite_friends',
        });
      }).catch((error) => {
        console.log('Error sharing:', error);
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareLink);
      toast.success(t('toasts.settings.inviteLinkCopied'));
    }
  };

  const getLanguageDisplay = () => {
    return i18n.language.startsWith('en') ? 'English' : 'Deutsch';
  };

  const getThemeDisplay = () => {
    return t(`dialogs.settings.theme${theme.charAt(0).toUpperCase() + theme.slice(1)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-primary">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-accent/30 px-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-secondary transition-colors active:text-highlight">
          <IconChevronLeft width={24} height={24} />
        </button>
        <h1 className="text-[20px] font-semibold text-secondary">{t('dialogs.settings.title')}</h1>
        <div className="w-8" /> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          {/* Preferences Section */}
          <SettingSection title={t('dialogs.settings.preferences')}>
            <SettingItem
              label={t('dialogs.settings.language')}
              value={getLanguageDisplay()}
              onClick={handleLanguageChange}
            />

            {/* <SettingItem
              label={t('dialogs.settings.theme')}
              value={getThemeDisplay()}
              onClick={handleThemeChange}
            /> */}

            <SettingToggle
              label={t('dialogs.settings.vibration')}
              description={t('dialogs.settings.vibrationDescription')}
              checked={vibrationEnabled}
              onChange={handleVibrationToggle}
            />
          </SettingSection>

          {/* Privacy Section */}
          <SettingSection title={t('dialogs.settings.privacy')}>
            <SettingToggle
              label={t('dialogs.settings.analytics')}
              description={t('dialogs.settings.analyticsDescription')}
              checked={analyticsEnabled}
              onChange={handleAnalyticsToggle}
            />
          </SettingSection>

          {/* Data Management Section */}
          <SettingSection title={t('dialogs.settings.dataManagement')}>
            {/* <SettingItem
              label={t('dialogs.settings.exportData')}
              description={t('dialogs.settings.exportDataDescription')}
              onClick={handleExportData}
            /> */}

            <SettingItem
              label={t('dialogs.settings.clearStorage')}
              description={t('dialogs.settings.clearStorageDescription')}
              onClick={handleClearStorage}
            />

            {/* <SettingItem
              label={t('dialogs.settings.deleteAccount')}
              description={t('dialogs.settings.deleteAccountDescription')}
              onClick={handleDeleteAccount}
            /> */}
          </SettingSection>

          {/* About Section */}
          <SettingSection title={t('dialogs.settings.about')}>
            <SettingItem label={t('dialogs.settings.website')} onClick={handleWebsite} />

            <SettingItem label={t('dialogs.settings.inviteFriends')} onClick={handleInviteFriends} />

            <SettingItem label={t('dialogs.settings.giveFeedback')} onClick={handleFeedback} />
          </SettingSection>

          {/* Legal Section */}
          <SettingSection title={t('general.legal')}>
            <SettingItem label={t('dialogs.settings.privacyPolicy')} onClick={handlePrivacyPolicy} />

            <SettingItem label={t('dialogs.settings.terms')} onClick={handleTerms} />
          </SettingSection>

          {/* Version - centered at bottom */}
          <div className="flex justify-center py-4">
            <span className="text-[14px] text-secondary/70">v{version}</span>
          </div>

          {/* Bottom spacing for safe area */}
          <div className="h-safe-area-inset-bottom" />
        </div>
      </div>
    </div>
  );
};
