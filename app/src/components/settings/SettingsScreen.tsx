import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../contexts/AppContext';
import { useDialogContext } from '../../contexts/DialogContext';
import { useFirebaseContext } from '../../contexts/FirebaseContext';
import { IconChevronLeft } from '../../assets/icons';
import { Feedback } from '../dialogs/Feedback.atom';
import { Dialog } from '../Dialog';
import { exportUserData, clearLocalStorage, deleteAllUserData } from '../../utils/dataManagement';
import toast from 'react-hot-toast';
import { AnalyticsEvent } from '../../utils/analytics';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import { cn } from '../../utils';

// Icon Components - Solid/Filled Style
const GlobeIcon = () => (
  <svg className="h-5 w-5 text-highlight" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 17.93A8.001 8.001 0 0 1 4.07 13H7a8 8 0 0 0 4 6.93zM13 19.93A8 8 0 0 0 17 13h2.93A8.001 8.001 0 0 1 13 19.93zM4.07 11A8.001 8.001 0 0 1 11 4.07V11H4.07zm8.93 0V4.07A8.001 8.001 0 0 1 19.93 11H13z" />
  </svg>
);

const ZapIcon = () => (
  <svg className="h-5 w-5 text-highlight" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="h-5 w-5 text-highlight" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 20V10h2v10h-2zm-6 0V4h2v16h-2zm-6 0v-6h2v6H6z" />
  </svg>
);

const TrashIcon = ({ destructive }: { destructive?: boolean }) => (
  <svg className={cn("h-5 w-5", destructive ? "text-red-400" : "text-highlight")} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const BookOpenIcon = () => (
  <svg className="h-5 w-5 text-highlight" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="h-5 w-5 text-highlight" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
  </svg>
);

const UserPlusIcon = () => (
  <svg className="h-5 w-5 text-highlight" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const MessageCircleIcon = () => (
  <svg className="h-5 w-5 text-highlight" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="h-5 w-5 text-highlight" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="h-5 w-5 text-highlight" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// Setting Row Component
const SettingRow = ({
  icon,
  label,
  description,
  value,
  onClick,
  toggle,
  checked,
  onChange,
  destructive,
  hideChevron,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  value?: string;
  onClick?: () => void;
  toggle?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  destructive?: boolean;
  hideChevron?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={toggle}
      className={cn(
        'flex w-full items-center justify-between p-4 text-left transition-colors',
        !toggle && 'active:bg-white/5'
      )}>
      <div className="flex items-center gap-3">
        {React.cloneElement(icon as React.ReactElement, { destructive })}
        <div className="flex flex-col">
          <span className={cn(
            "font-['Plus_Jakarta_Sans'] font-semibold",
            destructive ? "text-red-400" : "text-white"
          )}>
            {label}
          </span>
          {description && (
            <span className="mt-0.5 font-['Plus_Jakarta_Sans'] text-xs text-gray-400">
              {description}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center">
        {toggle && onChange && (
          <label className="relative inline-block h-6 w-11">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
              className="peer sr-only"
            />
            <span className="absolute inset-0 cursor-pointer rounded-full bg-gray-700 transition-colors peer-checked:bg-highlight"></span>
            <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"></span>
          </label>
        )}
        {value && (
          <span className="font-['Plus_Jakarta_Sans'] text-sm text-gray-400">{value}</span>
        )}
        {!toggle && !value && !hideChevron && <ChevronRightIcon />}
      </div>
    </button>
  );
};

// Divider Component
const SettingDivider = () => <div className="border-t border-white/5" />;

export const SettingsScreen = React.memo(({ onClose, isVisible }: { onClose: () => void; isVisible: boolean }) => {
  const { t, i18n } = useTranslation();
  const { version } = useAppContext();
  const dialogs = useDialogContext();
  const { logAnalyticsEvent } = useFirebaseContext();

  // Get current settings from localStorage
  const [vibrationEnabled, setVibrationEnabled] = useState(() => localStorage.getItem('vibrationEnabled') !== 'false');
  const [analyticsEnabled, setAnalyticsEnabled] = useState(() => localStorage.getItem('analyticsEnabled') !== 'false');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(
    () => (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system'
  );
  const [isScrolled, setIsScrolled] = useState(false);

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

    toast.dismiss();
    toast.success(enabled ? t('toasts.settings.vibrationEnabled') : t('toasts.settings.vibrationDisabled'));
  };

  const handleAnalyticsToggle = (enabled: boolean) => {
    setAnalyticsEnabled(enabled);
    localStorage.setItem('analyticsEnabled', enabled.toString());

    // Log this event (even if user is disabling analytics)
    logAnalyticsEvent(AnalyticsEvent.SETTINGS_CHANGED, {
      setting: 'analytics',
      value: enabled,
    });

    toast.dismiss();
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

    toast.dismiss();
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

  const handleClearStorage = () => {
    dialogs.push(
      <Dialog onClose={() => dialogs.pop()}>
        <div className="flex flex-col">
          {/* Title & Message */}
          <div className="flex w-full flex-col gap-4 px-6 pb-4 pt-8 text-center">
            <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-white">
              {t('dialogs.settings.confirmClearStorage')}
            </h2>
            <p className="px-2 font-['Plus_Jakarta_Sans'] text-sm text-gray-300">
              {t('dialogs.settings.confirmClearStorageMessage')}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex w-full flex-col gap-3 px-6 pb-6">
            <button
              onClick={async () => {
                dialogs.pop();
                try {
                  await clearLocalStorage();
                  logAnalyticsEvent(AnalyticsEvent.STORAGE_CLEARED);
                } catch (error) {
                  console.error('Clear storage failed:', error);
                }
              }}
              className={cn(
                'w-full rounded-2xl bg-warn px-6 py-4',
                'font-["Plus_Jakarta_Sans"] text-base font-bold text-white',
                'transition-all active:scale-95'
              )}>
              {t('general.yes')}
            </button>

            <button
              onClick={() => dialogs.pop()}
              className={cn(
                'w-full py-3 text-center',
                'font-["Plus_Jakarta_Sans"] text-sm text-gray-400',
                'transition-opacity hover:text-gray-300'
              )}>
              {t('general.cancel')}
            </button>
          </div>
        </div>
      </Dialog>
    );
  };

  const handleResetOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'false');
    window.location.reload();
  };

  const handleDeleteAccount = () => {
    dialogs.push(
      <Dialog onClose={() => dialogs.pop()}>
        <div className="flex flex-col">
          {/* Title & Message */}
          <div className="flex w-full flex-col gap-4 px-6 pb-4 pt-8 text-center">
            <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-white">
              {t('dialogs.settings.confirmDeleteAccount')}
            </h2>
            <p className="px-2 font-['Plus_Jakarta_Sans'] text-sm text-gray-300">
              {t('dialogs.settings.confirmDeleteAccountMessage')}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex w-full flex-col gap-3 px-6 pb-6">
            <button
              onClick={async () => {
                dialogs.pop();
                try {
                  await deleteAllUserData();
                  logAnalyticsEvent(AnalyticsEvent.ACCOUNT_DELETED);
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                } catch (error) {
                  console.error('Delete account failed:', error);
                }
              }}
              className={cn(
                'w-full rounded-2xl bg-warn px-6 py-4',
                'font-["Plus_Jakarta_Sans"] text-base font-bold text-white',
                'transition-all active:scale-95'
              )}>
              {t('general.yes')}
            </button>

            <button
              onClick={() => dialogs.pop()}
              className={cn(
                'w-full py-3 text-center',
                'font-["Plus_Jakarta_Sans"] text-sm text-gray-400',
                'transition-opacity hover:text-gray-300'
              )}>
              {t('general.cancel')}
            </button>
          </div>
        </div>
      </Dialog>
    );
  };

  const handleFeedback = () => {
    logAnalyticsEvent(AnalyticsEvent.FEEDBACK_OPENED);

    dialogs.push(
      <Dialog
        onClose={() => {
          dialogs.pop();
        }}>
        <Feedback />
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
      navigator
        .share({
          title: t('share.title'),
          text: t('share.text'),
          url: shareLink,
        })
        .then(() => {
          logAnalyticsEvent(AnalyticsEvent.EVENT_SHARED, {
            share_method: 'invite_friends',
          });
        })
        .catch((error) => {
          console.log('Error sharing:', error);
        });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareLink);
      toast.dismiss();
      toast.success(t('toasts.settings.inviteLinkCopied'));
    }
  };

  const getLanguageDisplay = () => {
    return i18n.language.startsWith('en') ? t('dialogs.settings.languageEnglish') : t('dialogs.settings.languageGerman');
  };

  const getThemeDisplay = () => {
    return t(`dialogs.settings.theme${theme.charAt(0).toUpperCase() + theme.slice(1)}`);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 0);
  };

  return (
    <div className={cn(
      "absolute inset-0 z-50 flex flex-col bg-primary transition-transform duration-300 ease-out",
      isVisible
        ? "translate-x-0 pointer-events-auto"
        : "translate-x-full pointer-events-none"
    )}>
      {/* Header */}
      <div className={`sticky top-0 z-10 flex h-16 items-center justify-between border-b border-accent/30 bg-primary px-4 pb-8 pt-safe-offset-6 transition-shadow duration-200 ${isScrolled ? 'shadow-[0_4px_12px_rgba(0,0,0,0.15)]' : ''}`}>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-secondary transition-colors active:text-highlight">
          <IconChevronLeft width={24} height={24} />
        </button>
        <h1 className="text-[20px] font-semibold text-secondary">{t('dialogs.settings.title')}</h1>
        <div className="w-8" /> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-safe-offset-0" onScroll={handleScroll}>
        <div className="mx-auto flex max-w-2xl flex-col">
          {/* Group 1: App Preferences */}
          <div className="mb-6 overflow-hidden rounded-3xl bg-primaryElevated">
            <SettingRow
              icon={<GlobeIcon />}
              label={t('dialogs.settings.language')}
              value={getLanguageDisplay()}
              onClick={handleLanguageChange}
            />
            <SettingDivider />
            <SettingRow
              icon={<ZapIcon />}
              label={t('dialogs.settings.vibration')}
              description={t('dialogs.settings.vibrationDescription')}
              toggle
              checked={vibrationEnabled}
              onChange={handleVibrationToggle}
            />
            <SettingDivider />
            <SettingRow
              icon={<ChartIcon />}
              label={t('dialogs.settings.analytics')}
              description={t('dialogs.settings.analyticsDescription')}
              toggle
              checked={analyticsEnabled}
              onChange={handleAnalyticsToggle}
            />
          </div>

          {/* Group 2: Actions */}
          <div className="mb-6 overflow-hidden rounded-3xl bg-primaryElevated">
            <SettingRow
              icon={<TrashIcon />}
              label={t('dialogs.settings.clearStorage')}
              description={t('dialogs.settings.clearStorageDescription')}
              onClick={handleClearStorage}
              destructive
              hideChevron
            />
            <SettingDivider />
            <SettingRow
              icon={<BookOpenIcon />}
              label={t('dialogs.settings.resetOnboarding')}
              description={t('dialogs.settings.resetOnboardingDescription')}
              onClick={handleResetOnboarding}
            />
          </div>

          {/* Group 3: Community */}
          <div className="mb-6 overflow-hidden rounded-3xl bg-primaryElevated">
            <SettingRow
              icon={<ExternalLinkIcon />}
              label={t('dialogs.settings.website')}
              onClick={handleWebsite}
            />
            <SettingDivider />
            <SettingRow
              icon={<UserPlusIcon />}
              label={t('dialogs.settings.inviteFriends')}
              onClick={handleInviteFriends}
            />
            <SettingDivider />
            <SettingRow
              icon={<MessageCircleIcon />}
              label={t('dialogs.settings.giveFeedback')}
              onClick={handleFeedback}
            />
          </div>

          {/* Group 4: Legal */}
          <div className="mb-6 overflow-hidden rounded-3xl bg-primaryElevated">
            <SettingRow
              icon={<ShieldIcon />}
              label={t('dialogs.settings.privacyPolicy')}
              onClick={handlePrivacyPolicy}
            />
            <SettingDivider />
            <SettingRow
              icon={<FileTextIcon />}
              label={t('dialogs.settings.terms')}
              onClick={handleTerms}
            />
          </div>

          {/* Version - centered at bottom */}
          <div className="mt-4 mb-10 flex justify-center pb-8">
            <span className="font-['Plus_Jakarta_Sans'] text-xs text-gray-600">v{version}</span>
          </div>
        </div>
      </div>
    </div>
  );
});
