import { useEffect } from 'react';
import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics';
import { Capacitor } from '@capacitor/core';
import { useFirebaseContext } from '../contexts/FirebaseContext';

/**
 * Custom hook to manage Firebase Crashlytics integration
 * Provides crash reporting, error logging, and user identification
 */
export const useCrashlytics = () => {
  const { user } = useFirebaseContext();
  const isNative = Capacitor.isNativePlatform();

  // Initialize Crashlytics and set user ID when user changes
  useEffect(() => {
    if (!isNative) {
      console.log('[Crashlytics] Skipping initialization - not a native platform');
      return;
    }

    const initCrashlytics = async () => {
      try {
        // Set user identifier if authenticated
        if (user?.uid) {
          await FirebaseCrashlytics.setUserId({ userId: user.uid });
          console.log('[Crashlytics] User ID set:', user.uid);

          // Set custom keys for better debugging
          await FirebaseCrashlytics.setCustomKey({
            key: 'user_authenticated',
            value: 'true',
            type: 'boolean',
          });
        } else {
          console.log('[Crashlytics] User not authenticated yet');
        }

        // Set app version for crash grouping
        await FirebaseCrashlytics.setCustomKey({
          key: 'platform',
          value: Capacitor.getPlatform(),
          type: 'string',
        });

        console.log('[Crashlytics] Initialized successfully');
      } catch (error) {
        console.error('[Crashlytics] Initialization error:', error);
      }
    };

    initCrashlytics();
  }, [user, isNative]);

  /**
   * Log a non-fatal error to Crashlytics
   */
  const logError = async (error: Error, context?: Record<string, any>) => {
    if (!isNative) {
      console.warn('[Crashlytics] Error logged (web):', error, context);
      return;
    }

    try {
      // Add context as custom keys if provided
      if (context) {
        for (const [key, value] of Object.entries(context)) {
          await FirebaseCrashlytics.setCustomKey({
            key,
            value: String(value),
            type: typeof value === 'number' ? 'double' : 'string',
          });
        }
      }

      // Record the exception
      // Note: Crashlytics will automatically capture the stack trace
      await FirebaseCrashlytics.recordException({
        message: `${error.name || 'Error'}: ${error.message || 'Unknown error'}${error.stack ? '\n' + error.stack : ''}`,
      });

      console.log('[Crashlytics] Error logged:', error.message);
    } catch (e) {
      console.error('[Crashlytics] Failed to log error:', e);
    }
  };

  /**
   * Log a custom message to Crashlytics
   */
  const log = async (message: string) => {
    if (!isNative) {
      console.log('[Crashlytics] Log (web):', message);
      return;
    }

    try {
      await FirebaseCrashlytics.log({ message });
    } catch (e) {
      console.error('[Crashlytics] Failed to log message:', e);
    }
  };

  /**
   * Set a custom key-value pair for crash reports
   */
  const setCustomKey = async (key: string, value: string | number | boolean) => {
    if (!isNative) {
      console.log('[Crashlytics] Custom key (web):', key, value);
      return;
    }

    try {
      await FirebaseCrashlytics.setCustomKey({
        key,
        value: String(value),
        type: typeof value === 'number' ? 'double' : typeof value === 'boolean' ? 'boolean' : 'string',
      });
    } catch (e) {
      console.error('[Crashlytics] Failed to set custom key:', e);
    }
  };

  /**
   * Enable or disable crash collection (useful for GDPR compliance)
   */
  const setCrashlyticsCollectionEnabled = async (enabled: boolean) => {
    if (!isNative) {
      console.log('[Crashlytics] Collection enabled (web):', enabled);
      return;
    }

    try {
      await FirebaseCrashlytics.setEnabled({ enabled });
      console.log('[Crashlytics] Collection enabled:', enabled);
    } catch (e) {
      console.error('[Crashlytics] Failed to set collection status:', e);
    }
  };

  /**
   * Check if Crashlytics is enabled
   */
  const isCrashlyticsEnabled = async (): Promise<boolean> => {
    if (!isNative) {
      return false;
    }

    try {
      const { enabled } = await FirebaseCrashlytics.isEnabled();
      return enabled;
    } catch (e) {
      console.error('[Crashlytics] Failed to check if enabled:', e);
      return false;
    }
  };

  /**
   * Trigger a test crash (USE WITH CAUTION - only for testing!)
   */
  const testCrash = async () => {
    if (!isNative) {
      console.warn('[Crashlytics] Test crash skipped - not a native platform');
      return;
    }

    try {
      console.warn('[Crashlytics] TRIGGERING TEST CRASH - App will crash!');
      await FirebaseCrashlytics.crash({ message: 'Test crash from useCrashlytics' });
    } catch (e) {
      console.error('[Crashlytics] Failed to trigger test crash:', e);
    }
  };

  return {
    logError,
    log,
    setCustomKey,
    setCrashlyticsCollectionEnabled,
    isCrashlyticsEnabled,
    testCrash,
    isNative,
  };
};
