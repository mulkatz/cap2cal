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

// Icon Components
const GlobeIcon = () => (
  <svg className="h-5 w-5 text-highlight" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ZapIcon = () => (
  <svg className="h-5 w-5 text-highlight" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ChartIcon = () => (
  <svg className="h-5 w-5 text-highlight" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const TrashIcon = ({ destructive }: { destructive?: boolean }) => (
  <svg className={cn("h-5 w-5", destructive ? "text-red-400" : "text-highlight")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const BookOpenIcon = () => (
  <svg className="h-5 w-5 text-highlight" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="h-5 w-5 text-highlight" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const UserPlusIcon = () => (
  <svg className="h-5 w-5 text-highlight" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

const MessageCircleIcon = () => (
  <svg className="h-5 w-5 text-highlight" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="h-5 w-5 text-highlight" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="h-5 w-5 text-highlight" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
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
        {!toggle && !value && <ChevronRightIcon />}
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
          <div className="mt-4 flex justify-center pb-8">
            <span className="font-['Plus_Jakarta_Sans'] text-xs text-gray-600">v{version}</span>
          </div>
        </div>
      </div>
    </div>
  );
});
