import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../contexts/AppContext';
import { useDialogContext } from '../contexts/DialogContext';
import { useFirebaseContext } from '../contexts/FirebaseContext';
import { useCrashlytics } from '../hooks/useCrashlytics';
import { IconChevronLeft } from '../assets/icons';
import {
  BarChart3,
  BookOpen,
  Bug,
  ChevronRight,
  ExternalLink,
  FileText,
  Globe,
  MessageCircle,
  Shield,
  Star,
  Trash2,
  UserPlus,
  Zap,
} from 'lucide-react';
import { Feedback } from '../components/features/dialogs/FeedbackDialog.tsx';
import { Dialog } from '../components/ui/Dialog.tsx';
import { PremiumConfirm } from '../components/features/modals/PremiumModal.tsx';
import { Card } from '../components/features/cards/CardGroup.tsx';
import { AppLikePrompt } from '../components/features/dialogs/AppLikePrompt.tsx';
import { clearLocalStorage, deleteAllUserData, exportUserData } from '../utils/dataManagement';
import toast from 'react-hot-toast';
import { AnalyticsEvent } from '../services/analytics.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import { cn } from '../utils';
import { isDeveloperModeEnabled } from '../utils/platform';
import { requestAppRating, isRatingAvailable } from '../services/rating.service.tsx';

// Icon Wrapper Components
const GlobeIcon = () => <Globe size={20} className="text-highlight" />;
const ZapIcon = () => <Zap size={20} className="text-highlight" fill="currentColor" />;
const ChartIcon = () => <BarChart3 size={20} className="text-highlight" />;
const TrashIcon = ({ destructive }: { destructive?: boolean }) => (
  <Trash2 size={20} className={destructive ? 'text-red-400' : 'text-highlight'} />
);
const BookOpenIcon = () => <BookOpen size={20} className="text-highlight" />;
const ExternalLinkIcon = () => <ExternalLink size={20} className="text-highlight" />;
const UserPlusIcon = () => <UserPlus size={20} className="text-highlight" />;
const MessageCircleIcon = () => <MessageCircle size={20} className="text-highlight" />;
const ShieldIcon = () => <Shield size={20} className="text-highlight" fill="currentColor" />;
const FileTextIcon = () => <FileText size={20} className="text-highlight" />;
const BugIcon = ({ destructive }: { destructive?: boolean }) => (
  <Bug size={20} className={destructive ? 'text-red-400' : 'text-highlight'} />
);
const StarIcon = () => <Star size={20} className="text-highlight" fill="currentColor" />;
const ChevronRightIcon = () => <ChevronRight size={20} className="text-gray-500" />;

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
          <span className={cn('font-semibold', destructive ? 'text-red-400' : 'text-white')}>{label}</span>
          {description && <span className="mt-0.5 text-xs text-gray-400">{description}</span>}
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
        {value && <span className="text-sm text-gray-400">{value}</span>}
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
  const { testCrash, isNative, logError } = useCrashlytics();

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
    // Import getNextLanguage to cycle through all supported languages
    const { getNextLanguage } = await import('../utils/i18n');
    const newLang = getNextLanguage(i18n.language);

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
      <PremiumConfirm
        title={t('dialogs.settings.confirmClearStorage')}
        message={t('dialogs.settings.confirmClearStorageMessage')}
        confirmText={t('general.yes')}
        cancelText={t('general.cancel')}
        destructive
        onConfirm={async () => {
          try {
            await clearLocalStorage();
            logAnalyticsEvent(AnalyticsEvent.STORAGE_CLEARED);
          } catch (error) {
            console.error('Clear storage failed:', error);
          }
        }}
        onClose={() => dialogs.pop()}
      />
    );
  };

  const handleResetOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'false');
    window.location.reload();
  };

  const handleDeleteAccount = () => {
    dialogs.push(
      <PremiumConfirm
        title={t('dialogs.settings.confirmDeleteAccount')}
        message={t('dialogs.settings.confirmDeleteAccountMessage')}
        confirmText={t('general.yes')}
        cancelText={t('general.cancel')}
        destructive
        onConfirm={async () => {
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
        onClose={() => dialogs.pop()}
      />
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

  const handleTestCrash = () => {
    dialogs.push(
      <PremiumConfirm
        title={t('dialogs.settings.confirmTestCrash')}
        message={t('dialogs.settings.confirmTestCrashMessage')}
        confirmText={t('general.yes')}
        cancelText={t('general.cancel')}
        destructive
        onConfirm={async () => {
          try {
            // Log a test error first
            await logError(new Error('Test error - this is intentional'), {
              test_type: 'manual_test',
              screen: 'settings',
            });

            toast.dismiss();
            toast(t('toasts.settings.testCrashScheduled'), { duration: 2000 });

            // Wait 2 seconds then crash
            setTimeout(async () => {
              await testCrash();
            }, 2000);
          } catch (error) {
            console.error('Test crash failed:', error);
            toast.dismiss();
            toast.error(t('toasts.settings.testCrashFailed'));
          }
        }}
        onClose={() => dialogs.pop()}
      />
    );
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

  const handleRateApp = () => {
    logAnalyticsEvent(AnalyticsEvent.RATE_APP_SETTINGS_CLICKED);

    // Show AppPrompt dialog first (instead of directly showing native rating)
    dialogs.push(
      <Dialog
        onClose={() => {
          logAnalyticsEvent(AnalyticsEvent.REVIEW_PROMPT_DISMISSED);
          dialogs.pop();
        }}>
        <Card>
          <AppLikePrompt onLike={handleAppLiked} onDislike={handleAppDisliked} />
        </Card>
      </Dialog>
    );
  };

  /**
   * Handle when user clicks "Yes, I love it!" from settings rate app
   */
  const handleAppLiked = async () => {
    // Request app rating with fallback
    await requestAppRating(true, logAnalyticsEvent, t);
  };

  /**
   * Handle when user clicks "Not really" from settings rate app
   */
  const handleAppDisliked = () => {
    // Show feedback dialog
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

  const getLanguageDisplay = () => {
    const lang = i18n.language;
    if (lang.startsWith('de')) return t('dialogs.settings.languageGerman');
    if (lang.startsWith('es')) return t('dialogs.settings.languageSpanish');
    if (lang.startsWith('fr')) return t('dialogs.settings.languageFrench');
    if (lang.startsWith('pt')) return t('dialogs.settings.languagePortuguese');
    return t('dialogs.settings.languageEnglish');
  };

  const getThemeDisplay = () => {
    return t(`dialogs.settings.theme${theme.charAt(0).toUpperCase() + theme.slice(1)}`);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 0);
  };

  return (
    <div
      className={cn(
        'absolute inset-0 z-50 flex flex-col bg-primary transition-transform duration-300 ease-out',
        isVisible ? 'pointer-events-auto translate-x-0' : 'pointer-events-none translate-x-full'
      )}>
      {/* Header */}
      <div
        className={`sticky top-0 z-10 flex h-16 items-center justify-between border-b border-accent/30 bg-primary px-4 pb-8 transition-shadow duration-200 pt-safe-offset-6 ${isScrolled ? 'shadow-[0_4px_12px_rgba(0,0,0,0.15)]' : ''}`}>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-secondary transition-colors active:text-highlight">
          <IconChevronLeft size={24} />
        </button>
        <h1 className="text-[20px] font-semibold text-secondary">{t('dialogs.settings.title')}</h1>
        <div className="w-8" />
        {/* Spacer for centering */}
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
            <SettingRow icon={<ExternalLinkIcon />} label={t('dialogs.settings.website')} onClick={handleWebsite} />
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
            {/* Only show Rate App on native platforms */}
            {isRatingAvailable() && (
              <>
                <SettingDivider />
                <SettingRow
                  icon={<StarIcon />}
                  label={t('dialogs.settings.rateApp')}
                  onClick={handleRateApp}
                />
              </>
            )}
          </div>

          {/* Group 4: Legal */}
          <div className="mb-6 overflow-hidden rounded-3xl bg-primaryElevated">
            <SettingRow
              icon={<ShieldIcon />}
              label={t('dialogs.settings.privacyPolicy')}
              onClick={handlePrivacyPolicy}
            />
            <SettingDivider />
            <SettingRow icon={<FileTextIcon />} label={t('dialogs.settings.terms')} onClick={handleTerms} />
          </div>

          {/* Group 5: Debug/Developer (only when developer mode is enabled AND on native platforms) */}
          {isDeveloperModeEnabled() && isNative && (
            <div className="mb-6 overflow-hidden rounded-3xl bg-primaryElevated">
              <SettingRow
                icon={<BugIcon />}
                label={t('dialogs.settings.testCrashlytics')}
                description={t('dialogs.settings.testCrashlyticsDescription')}
                onClick={handleTestCrash}
                destructive
                hideChevron
              />
            </div>
          )}

          {/* Version - centered at bottom */}
          <div className="mb-2 mt-2 flex justify-center pb-2">
            <span className="text-xs text-gray-600">v{version}</span>
          </div>
        </div>
      </div>
    </div>
  );
});
