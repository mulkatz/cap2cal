/**
 * Rating Service
 *
 * Handles app rating flow with native in-app review dialog and App Store/Play Store fallback.
 *
 * Strategy:
 * 1. Show custom pre-prompt dialog ("Are you enjoying Cap2Cal?")
 * 2. If YES → Attempt native rating dialog
 * 3. Fallback:
 *    - iOS: Native dialog has strict quotas (3/year), may not show
 *      → Wait 1.5s, then offer App Store link
 *    - Android: Check if dialog was shown via API response
 *      → If not shown, open Play Store directly
 */

import { InAppReview } from '@capacitor-community/in-app-review';
import { Capacitor } from '@capacitor/core';
import { logger } from '../utils/logger';
import toast from 'react-hot-toast';
import { AnalyticsEvent } from './analytics.service';

// App Store URLs
const APP_STORE_ID = '6754225481'; // Capture2Calendar App Store ID
const PLAY_STORE_ID = 'cx.franz.cap2cal'; // Capture2Calendar Play Store package name

const IOS_APP_STORE_URL = `https://apps.apple.com/app/id${APP_STORE_ID}?action=write-review`;
const ANDROID_PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PLAY_STORE_ID}&reviewId=0`;

// Alternative: Use market:// URLs for direct app store opening (more reliable on native)
const IOS_MARKET_URL = `itms-apps://itunes.apple.com/app/id${APP_STORE_ID}?action=write-review`;
const ANDROID_MARKET_URL = `market://details?id=${PLAY_STORE_ID}`;

export interface RatingResult {
  success: boolean;
  nativeDialogShown: boolean;
  fallbackUsed: boolean;
  error?: string;
}

/**
 * Request native in-app rating dialog with automatic fallback to store
 *
 * @param showToastOnFallback - Whether to show a toast when falling back to store
 * @param logAnalyticsEvent - Function to log analytics events
 * @param t - Translation function for i18n support
 * @returns Result object with success status and metadata
 */
export const requestAppRating = async (
  showToastOnFallback: boolean = true,
  logAnalyticsEvent?: (event: string, params?: Record<string, any>) => void,
  t?: (key: string) => string
): Promise<RatingResult> => {
  const platform = Capacitor.getPlatform();

  logger.info('RatingService', `Requesting app rating on ${platform}`);

  // Not available on web
  if (platform === 'web') {
    logger.warn('RatingService', 'In-app review not available on web');
    return {
      success: false,
      nativeDialogShown: false,
      fallbackUsed: false,
      error: 'Not available on web',
    };
  }

  try {
    // Attempt native in-app review
    await InAppReview.requestReview();

    logger.info('RatingService', 'Native review API called successfully');
    logAnalyticsEvent?.(AnalyticsEvent.NATIVE_REVIEW_TRIGGERED, { platform });

    // Platform-specific fallback handling
    if (platform === 'ios') {
      return await handleIOSRatingFallback(showToastOnFallback, logAnalyticsEvent, t);
    } else if (platform === 'android') {
      return await handleAndroidRatingFallback(showToastOnFallback, logAnalyticsEvent, t);
    }

    logAnalyticsEvent?.(AnalyticsEvent.NATIVE_REVIEW_SUCCESS, { platform });
    return {
      success: true,
      nativeDialogShown: true,
      fallbackUsed: false,
    };
  } catch (error) {
    logger.error('RatingService', 'Native review API failed', error instanceof Error ? error : undefined);
    logAnalyticsEvent?.(AnalyticsEvent.NATIVE_REVIEW_ERROR, {
      platform,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    // If native API fails, open store directly
    await openAppStore(logAnalyticsEvent);

    return {
      success: false,
      nativeDialogShown: false,
      fallbackUsed: true,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * iOS-specific: Wait for native dialog, then offer App Store fallback
 *
 * iOS doesn't tell us if the dialog was shown due to quota limits.
 * We wait 1.5s to give the native dialog time to appear, then offer
 * a subtle option to go to the App Store.
 */
const handleIOSRatingFallback = async (
  showToast: boolean,
  logAnalyticsEvent?: (event: string, params?: Record<string, any>) => void,
  t?: (key: string) => string
): Promise<RatingResult> => {
  logger.info('RatingService', 'iOS: Waiting 1.5s for native dialog, then showing fallback option');

  // Wait for native dialog to potentially appear
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Show subtle fallback option (toast)
  if (showToast) {
    logAnalyticsEvent?.(AnalyticsEvent.NATIVE_REVIEW_FALLBACK_SHOWN, { platform: 'ios' });

    const fallbackMessage = t?.('toasts.rating.fallbackMessage') || "Didn't see the rating dialog?";
    const buttonText = t?.('toasts.rating.rateOnAppStore') || 'Rate on App Store';

    toast(
      (toastData) => (
        <div className="flex items-center gap-3">
          <span className="text-sm text-white">{fallbackMessage}</span>
          <button
            onClick={() => {
              toast.dismiss(toastData.id);
              logAnalyticsEvent?.(AnalyticsEvent.STORE_OPENED_FROM_FALLBACK, { platform: 'ios' });
              openAppStore(logAnalyticsEvent);
            }}
            className="rounded-full bg-highlight px-3 py-1 text-xs font-semibold text-primaryDark transition-opacity active:opacity-80">
            {buttonText}
          </button>
        </div>
      ),
      {
        duration: 6000,
        position: 'bottom-center',
        style: {
          background: '#1a1a1a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '12px 16px',
        },
      }
    );
  }

  return {
    success: true,
    nativeDialogShown: true, // We assume it might have been shown
    fallbackUsed: true, // We offered fallback
  };
};

/**
 * Android-specific: Wait for native dialog, then offer Play Store fallback
 *
 * Android API also doesn't reliably tell us if the dialog was shown.
 * The dialog may not appear if the user already rated, quota exceeded, or recently dismissed.
 * We wait 1.5s to give the native dialog time to appear, then offer
 * a subtle option to go to the Play Store.
 */
const handleAndroidRatingFallback = async (
  showToast: boolean,
  logAnalyticsEvent?: (event: string, params?: Record<string, any>) => void,
  t?: (key: string) => string
): Promise<RatingResult> => {
  logger.info('RatingService', 'Android: Waiting 1.5s for native dialog, then showing fallback option');

  // Wait for native dialog to potentially appear
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Show subtle fallback option (toast)
  if (showToast) {
    logAnalyticsEvent?.(AnalyticsEvent.NATIVE_REVIEW_FALLBACK_SHOWN, { platform: 'android' });

    const fallbackMessage = t?.('toasts.rating.fallbackMessage') || "Didn't see the rating dialog?";
    const buttonText = t?.('toasts.rating.rateOnPlayStore') || 'Rate on Play Store';

    toast(
      (toastData) => (
        <div className="flex items-center gap-3">
          <span className="text-sm text-white">{fallbackMessage}</span>
          <button
            onClick={() => {
              toast.dismiss(toastData.id);
              logAnalyticsEvent?.(AnalyticsEvent.STORE_OPENED_FROM_FALLBACK, { platform: 'android' });
              openAppStore(logAnalyticsEvent);
            }}
            className="rounded-full bg-highlight px-3 py-1 text-xs font-semibold text-primaryDark transition-opacity active:opacity-80">
            {buttonText}
          </button>
        </div>
      ),
      {
        duration: 6000,
        position: 'bottom-center',
        style: {
          background: '#1a1a1a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '12px 16px',
        },
      }
    );
  }

  return {
    success: true,
    nativeDialogShown: true, // We assume it might have been shown
    fallbackUsed: true, // We offered fallback
  };
};

/**
 * Open the App Store (iOS) or Play Store (Android) directly
 *
 * Tries market:// URLs first (opens native store app),
 * falls back to HTTPS URLs if that fails
 */
export const openAppStore = async (
  logAnalyticsEvent?: (event: string, params?: Record<string, any>) => void
): Promise<void> => {
  const platform = Capacitor.getPlatform();

  logger.info('RatingService', `Opening ${platform === 'ios' ? 'App Store' : 'Play Store'} directly`);
  logAnalyticsEvent?.(AnalyticsEvent.STORE_OPENED_DIRECTLY, { platform });

  let primaryUrl = '';
  let fallbackUrl = '';

  if (platform === 'ios') {
    primaryUrl = IOS_MARKET_URL;
    fallbackUrl = IOS_APP_STORE_URL;
  } else if (platform === 'android') {
    primaryUrl = ANDROID_MARKET_URL;
    fallbackUrl = ANDROID_PLAY_STORE_URL;
  } else {
    logger.warn('RatingService', 'openAppStore called on unsupported platform:', platform);
    return;
  }

  try {
    // Try market:// URL first (opens native store app)
    window.open(primaryUrl, '_system');
    logger.info('RatingService', 'Opened store via market:// URL');
  } catch (error) {
    logger.warn(
      'RatingService',
      'market:// URL failed, trying HTTPS fallback',
      error instanceof Error ? error : undefined
    );

    try {
      // Fallback to HTTPS URL
      window.open(fallbackUrl, '_system');
      logger.info('RatingService', 'Opened store via HTTPS URL');
    } catch (fallbackError) {
      logger.error(
        'RatingService',
        'Both store URLs failed',
        fallbackError instanceof Error ? fallbackError : undefined
      );
    }
  }
};

/**
 * Check if in-app review is available on this platform
 */
export const isRatingAvailable = (): boolean => {
  const platform = Capacitor.getPlatform();
  return platform === 'ios' || platform === 'android';
};
