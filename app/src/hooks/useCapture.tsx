import React, { ChangeEvent, RefObject, useEffect, useState } from 'react';
import { PaywallSheet } from '../components/dialogs/PaywallSheet.tsx';
import { CaptureEvent } from '../models/CaptureEvent.ts';
import toast from 'react-hot-toast';
import { useDialogContext } from '../contexts/DialogContext.tsx';
import { ApiEvent, ExtractionError } from '../api/model.ts';
import { db } from '../models/db.ts';
import { fetchData } from '../api/api.ts';
import { useTranslation } from 'react-i18next';
import { useFirebaseContext } from '../contexts/FirebaseContext.tsx';
import i18next from 'i18next';
import { useAppContext } from '../contexts/AppContext.tsx';
import { AnalyticsEvent, AnalyticsParam, getEventFieldsPresence } from '../utils/analytics.ts';
import { incrementCaptureCount, getCaptureCount, hasReachedLimit, resetCaptureCount } from '../utils/captureLimit.ts';
import { logger } from '../utils/logger';
import { purchasePackage, restorePurchases, PurchaseErrorType, isRevenueCatEnabled } from '../services/purchases.service.ts';
import type { PurchaseError } from '../services/purchases.service.ts';
import {
  shouldShowReviewPrompt,
  resetReviewPromptTracking,
  getReviewPromptDebugInfo,
} from '../utils/reviewPrompt.ts';

export const useCapture = () => {
  const [capturedImage, setCapturedImage] = useState<string>();
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const { t } = useTranslation();
  const dialogs = useDialogContext();
  const { logAnalyticsEvent, trackPerformance, getAuthToken, featureFlags, refreshProStatus } = useFirebaseContext();
  const { appState, setAppState, setResultData } = useAppContext();

  const onCaptured = async (imgUrl: string, imageSource: 'camera' | 'gallery' | 'share' = 'camera') => {
    setCapturedImage(imgUrl);

    // Set appState to loading to ensure state transition for review prompt
    // This creates: home/camera → loading → home transition
    setAppState('loading');

    // Track extraction started
    const extractionStartTime = performance.now();
    logAnalyticsEvent(AnalyticsEvent.EXTRACTION_STARTED, {
      [AnalyticsParam.IMAGE_SOURCE]: imageSource,
    });

    // Loading state is now handled by ResultView, no need to push dialog

    const hasRequiredData = (item: ApiEvent) => {
      return item.title && item.dateTimeFrom && item.dateTimeFrom.date;
    };

    try {
      // Get auth token to send to backend
      const authToken = await getAuthToken();

      // Track image upload
      const uploadStartTime = performance.now();
      logAnalyticsEvent(AnalyticsEvent.IMAGE_UPLOAD_STARTED);

      const result = await fetchData(imgUrl, i18next.language, authToken || undefined);

      // Track upload completion
      const uploadDuration = performance.now() - uploadStartTime;
      trackPerformance('upload', uploadDuration);
      logAnalyticsEvent(AnalyticsEvent.IMAGE_UPLOAD_COMPLETED, {
        [AnalyticsParam.DURATION_MS]: Math.round(uploadDuration),
      });

      // Note: Backend increments capture count, so we don't need to do it here
      // No need to pop dialog anymore

      if ('success' === result.status) {
        const items = result.data.items;
        const sanitizedItems: ApiEvent[] = [];
        items.forEach((item) => {
          if (hasRequiredData(item)) {
            sanitizedItems.push(item);
          }
        });

        // console.log('got items', items);

        if (sanitizedItems.length === 0) {
          const extractionDuration = performance.now() - extractionStartTime;
          trackPerformance('extraction', extractionDuration);

          logAnalyticsEvent(AnalyticsEvent.EXTRACTION_ERROR, {
            [AnalyticsParam.EXTRACTION_REASON]: 'PROBABLY_NOT_AN_EVENT' satisfies ExtractionError,
            [AnalyticsParam.IMAGE_SOURCE]: imageSource,
            [AnalyticsParam.DURATION_MS]: Math.round(extractionDuration),
          });

          pushError('PROBABLY_NOT_AN_EVENT');
          return;
        }

        const createEvents = (items: ApiEvent[]) => {
          let createdAt = Date.now(); // Initialize the base timestamp

          // Helper function to create a CaptureEvent
          const createCaptureEvent = (event: ApiEvent): CaptureEvent => {
            const captureEvent: CaptureEvent = {
              ...event,
              timestamp: createdAt,
              isFavorite: false,
              img: {
                dataUrl: imgUrl,
                id: event.id,
                capturedAt: createdAt,
              },
            } satisfies CaptureEvent;
            createdAt += 1; // Increment the timestamp for the next event
            return captureEvent;
          };

          const events: CaptureEvent[] = items.map(createCaptureEvent);

          return events;
        };

        const events = createEvents(sanitizedItems);

        // Increment capture count on successful extraction
        const newCount = incrementCaptureCount();
        logger.info('Capture', `Success! Total captures: ${newCount}`);

        // Track extraction success with comprehensive data
        const extractionDuration = performance.now() - extractionStartTime;
        trackPerformance('extraction', extractionDuration);
        trackPerformance('total_capture', extractionDuration);

        // Analyze the first event for field presence
        const firstEvent = sanitizedItems[0];
        const eventFieldsPresence = getEventFieldsPresence(firstEvent);

        logAnalyticsEvent(AnalyticsEvent.EXTRACTION_SUCCESS, {
          [AnalyticsParam.IMAGE_SOURCE]: imageSource,
          [AnalyticsParam.HAS_MULTIPLE_IMAGES]: events.length > 1,
          [AnalyticsParam.DURATION_MS]: Math.round(extractionDuration),
          ...eventFieldsPresence,
        });

        // Track event preview viewed
        logAnalyticsEvent(AnalyticsEvent.EVENT_PREVIEW_VIEWED, {
          event_count: events.length,
        });

        // Show success toast
        toast.dismiss(); // Dismiss any existing toasts
        if (events.length > 1) {
          toast.success(t('toasts.capture.multipleEvents', { count: events.length }), {
            style: {
              borderColor: '#2C4156',
              backgroundColor: '#1E2E3F',
              color: '#FDDCFF',
            },
            duration: 2500,
          });
          await Promise.all(events.map((event) => saveEvent(event, imgUrl)));

          // Set result data and transition to result state
          setResultData({
            type: 'multi',
            events: events,
          });
          setAppState('result');
        } else {
          toast.success(t('toasts.capture.singleEvent'), {
            style: {
              borderColor: '#2C4156',
              backgroundColor: '#1E2E3F',
              color: '#FDDCFF',
            },
            duration: 2500,
          });
          await saveEvent(events[0], imgUrl);

          // Set result data and transition to result state
          setResultData({
            type: 'single',
            events: [events[0]],
          });
          setAppState('result');
        }
        return;
      }

      const extractionDuration = performance.now() - extractionStartTime;
      trackPerformance('extraction', extractionDuration);

      const errorReason = result.data?.reason || 'UNKNOWN';
      logger.error('Capture', `Extraction failed with reason: ${errorReason}`, undefined, { imageSource });

      pushError(errorReason);
      logAnalyticsEvent(AnalyticsEvent.EXTRACTION_ERROR, {
        [AnalyticsParam.EXTRACTION_REASON]: errorReason,
        [AnalyticsParam.IMAGE_SOURCE]: imageSource,
        [AnalyticsParam.DURATION_MS]: Math.round(extractionDuration),
      });
    } catch (e) {
      const extractionDuration = performance.now() - extractionStartTime;
      trackPerformance('extraction', extractionDuration);

      // Log the actual error
      logger.error('Capture', 'Extraction failed with exception', e instanceof Error ? e : undefined, { imageSource });

      pushError('UNKNOWN');
      logAnalyticsEvent(AnalyticsEvent.EXTRACTION_ERROR, {
        [AnalyticsParam.EXTRACTION_REASON]: 'UNKNOWN' satisfies ExtractionError,
        [AnalyticsParam.IMAGE_SOURCE]: imageSource,
        [AnalyticsParam.DURATION_MS]: Math.round(extractionDuration),
      });
    } finally {
      setCapturedImage(undefined);
    }
  };

  const pushError = (reason: ExtractionError) => {
    // Show paywall sheet if limit is reached (only if RevenueCat is enabled)
    if (reason === 'LIMIT_REACHED') {
      // Only show paywall if RevenueCat is enabled
      if (isRevenueCatEnabled()) {
        setIsPaywallOpen(true);
        setAppState('home'); // Go back to home when showing paywall

        // Track paywall view
        logAnalyticsEvent('paywall_viewed', {
          trigger: 'limit_reached',
        });
        return;
      } else {
        // RevenueCat disabled - show generic error instead
        logger.info('Paywall', 'Limit reached but RevenueCat is disabled');
        setResultData({
          type: 'error',
          errorReason: 'UNKNOWN',
        });
        setAppState('result');
        return;
      }
    }

    // Show error in result state
    setResultData({
      type: 'error',
      errorReason: reason,
    });
    setAppState('result');
  };

  const handlePaywallClose = () => {
    setIsPaywallOpen(false);
    setAppState('home');

    // Track paywall dismissal
    logAnalyticsEvent('paywall_dismissed', {
      trigger: 'user_close',
    });
  };

  const handleSelectPlan = async (plan: 'monthly' | 'yearly') => {
    logger.info('Paywall', `User selected plan: ${plan}`);

    // Track purchase initiation
    logAnalyticsEvent(AnalyticsEvent.SUBSCRIPTION_PURCHASE_INITIATED, {
      [AnalyticsParam.SUBSCRIPTION_PLAN]: plan,
      source: 'paywall',
    });

    setPurchaseLoading(true);

    try {
      // Map plan selection to product ID
      const packageType = plan === 'monthly' ? 'MONTHLY' : 'YEARLY';

      // Initiate purchase flow
      const customerInfo = await purchasePackage(packageType as 'MONTHLY' | 'YEARLY');

      // Purchase successful
      logger.info('Paywall', `Purchase successful for plan: ${plan}`);

      // Track purchase success
      logAnalyticsEvent(AnalyticsEvent.SUBSCRIPTION_PURCHASE_SUCCESS, {
        [AnalyticsParam.SUBSCRIPTION_PLAN]: plan,
        source: 'paywall',
      });

      // Refresh pro status (will trigger UI updates)
      await refreshProStatus();

      // Close paywall and show success toast
      setIsPaywallOpen(false);
      setAppState('home');

      toast.success(t('toasts.subscription.success') || 'Welcome to Pro!', {
        style: {
          borderColor: '#2C4156',
          backgroundColor: '#1E2E3F',
          color: '#FDDCFF',
        },
        duration: 3000,
      });
    } catch (error: any) {
      const purchaseError = error as PurchaseError;

      // Handle user cancellation gracefully (don't show error)
      if (purchaseError.type === PurchaseErrorType.USER_CANCELLED) {
        logger.info('Paywall', 'User cancelled purchase');

        logAnalyticsEvent(AnalyticsEvent.SUBSCRIPTION_PURCHASE_CANCELLED, {
          [AnalyticsParam.SUBSCRIPTION_PLAN]: plan,
          source: 'paywall',
        });

        // Don't close paywall, let user try again
        setPurchaseLoading(false);
        return;
      }

      // Handle other errors
      logger.error('Paywall', `Purchase failed: ${purchaseError.message}`, purchaseError.originalError);

      logAnalyticsEvent(AnalyticsEvent.SUBSCRIPTION_PURCHASE_FAILED, {
        [AnalyticsParam.SUBSCRIPTION_PLAN]: plan,
        [AnalyticsParam.ERROR_CODE]: purchaseError.type,
        [AnalyticsParam.ERROR_MESSAGE]: purchaseError.message,
        source: 'paywall',
      });

      // Show error toast
      const errorMessage = getUserFriendlyErrorMessage(purchaseError.type, t);
      toast.error(errorMessage, {
        style: {
          borderColor: '#2C4156',
          backgroundColor: '#1E2E3F',
          color: '#FDDCFF',
        },
        duration: 4000,
      });
    } finally {
      setPurchaseLoading(false);
    }
  };

  /**
   * Handle restore purchases (for users who already purchased)
   */
  const handleRestorePurchases = async () => {
    logger.info('Paywall', 'User requested to restore purchases');

    setPurchaseLoading(true);

    try {
      const isPro = await restorePurchases();

      if (isPro) {
        logger.info('Paywall', 'Purchases restored successfully');

        // Track restoration success
        logAnalyticsEvent(AnalyticsEvent.SUBSCRIPTION_RESTORED, {
          success: true,
        });

        // Refresh pro status
        await refreshProStatus();

        // Close paywall and show success
        setIsPaywallOpen(false);
        setAppState('home');

        toast.success(t('toasts.subscription.restored') || 'Purchases restored!', {
          style: {
            borderColor: '#2C4156',
            backgroundColor: '#1E2E3F',
            color: '#FDDCFF',
          },
          duration: 3000,
        });
      } else {
        logger.info('Paywall', 'No active subscriptions found to restore');

        // Track restoration failure (no active subscription)
        logAnalyticsEvent(AnalyticsEvent.SUBSCRIPTION_RESTORED, {
          success: false,
          reason: 'no_active_subscription',
        });

        toast.error(t('toasts.subscription.noPurchases') || 'No active subscriptions found', {
          style: {
            borderColor: '#2C4156',
            backgroundColor: '#1E2E3F',
            color: '#FDDCFF',
          },
          duration: 3000,
        });
      }
    } catch (error: any) {
      logger.error('Paywall', 'Failed to restore purchases', error);

      logAnalyticsEvent(AnalyticsEvent.SUBSCRIPTION_RESTORED, {
        success: false,
        reason: 'error',
      });

      toast.error(t('toasts.subscription.restoreError') || 'Failed to restore purchases', {
        style: {
          borderColor: '#2C4156',
          backgroundColor: '#1E2E3F',
          color: '#FDDCFF',
        },
        duration: 3000,
      });
    } finally {
      setPurchaseLoading(false);
    }
  };

  /**
   * Get user-friendly error message based on error type
   */
  const getUserFriendlyErrorMessage = (errorType: PurchaseErrorType, t: any): string => {
    switch (errorType) {
      case PurchaseErrorType.NETWORK_ERROR:
        return t('toasts.subscription.networkError') || 'Network error. Please check your connection.';
      case PurchaseErrorType.PAYMENT_FAILED:
        return t('toasts.subscription.paymentFailed') || 'Payment failed. Please try again.';
      case PurchaseErrorType.PRODUCT_NOT_AVAILABLE:
        return t('toasts.subscription.productUnavailable') || 'This plan is currently unavailable.';
      default:
        return t('toasts.subscription.unknownError') || 'Something went wrong. Please try again.';
    }
  };

  const toastError = () => {
    toast.error(t('toasts.extract.error'), {
      style: {
        borderColor: '#2C4156',
        backgroundColor: '#1E2E3F',
        color: '#FDDCFF',
      },
      duration: 2500,
    });
  };

  const toastSuccess = () => {
    toast.success(t('toasts.extract.success'), {
      style: {
        borderColor: '#2C4156',
        backgroundColor: '#1E2E3F',
        color: '#FDDCFF',
      },
      duration: 2500,
    });
  };

  const popAndBackHome = () => {
    // Clear result data and go back to home
    setResultData(null);
    setAppState('home');
  };

  const saveEvent = async (event: CaptureEvent, imgUrl: string) => {
    await db.eventItems.add(event, event.id);
    const img = { id: event.id, dataUrl: imgUrl, capturedAt: Date.now() };
    await db.images.add(img, event.id);
  };

  const onImport = (ref: RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, ref: RefObject<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    logger.debug('FileImport', 'File selection initiated');

    // Track image selection from gallery
    logAnalyticsEvent(AnalyticsEvent.IMAGE_SELECTED_FROM_GALLERY);

    if (file) {
      const dataType = file.type;
      const reader = new FileReader();
      reader.onloadend = () => {
        logger.debug('FileImport', 'File read completed', { fileType: dataType });
        const base64String = reader.result as string; // The result is a Base64 string
        onCaptured(base64String, 'gallery');

        if (ref?.current) {
          ref.current.value = '';
        }
      };
      reader.readAsDataURL(file); // Convert the file to a Base64 string
    }
  };

  // Dev function to test paywall - only in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      // Expose dev function to window object for testing
      (window as any).__triggerPaywall = () => {
        logger.debug('DevTools', 'Triggering paywall sheet');
        setIsPaywallOpen(true);
        logAnalyticsEvent('paywall_viewed', {
          trigger: 'dev_test',
        });
      };

      // Also expose a function to trigger any error type
      (window as any).__triggerError = (errorType: ExtractionError) => {
        logger.debug('DevTools', `Triggering error: ${errorType}`);
        pushError(errorType);
      };

      // Expose capture limit dev functions
      (window as any).__getCaptureCount = () => {
        const count = getCaptureCount();
        logger.debug('DevTools', `Current capture count: ${count}`);
        return count;
      };

      (window as any).__incrementCaptureCount = () => {
        const newCount = incrementCaptureCount();
        logger.debug('DevTools', `Incremented capture count to: ${newCount}`);
        return newCount;
      };

      (window as any).__resetCaptureCount = () => {
        resetCaptureCount();
        logger.debug('DevTools', 'Reset capture count to 0');
      };

      (window as any).__checkLimit = () => {
        const limitReached = checkCaptureLimit();
        const count = getCaptureCount();
        const limit = featureFlags?.free_capture_limit || 5;
        logger.debug('DevTools', `Capture count: ${count}/${limit}, Limit reached: ${limitReached}`);
        return limitReached;
      };

      // Review prompt dev functions
      (window as any).__shouldShowReviewPrompt = () => {
        const count = getCaptureCount();
        const shouldShow = shouldShowReviewPrompt(count);
        logger.debug('DevTools', `Should show review prompt: ${shouldShow} (count: ${count})`);
        return shouldShow;
      };

      (window as any).__resetReviewPrompt = () => {
        resetReviewPromptTracking();
        logger.debug('DevTools', 'Reset review prompt tracking');
      };

      (window as any).__reviewPromptInfo = () => {
        const info = getReviewPromptDebugInfo();
        logger.debug('DevTools', 'Review prompt info:', info);
        return info;
      };

      logger.info('DevTools', '🧪 Paywall dev functions available:');
      logger.info('DevTools', '  - window.__triggerPaywall() - Show paywall sheet');
      logger.info('DevTools', '  - window.__triggerError("LIMIT_REACHED") - Trigger limit reached error');
      logger.info('DevTools', '  - window.__triggerError("PROBABLY_NOT_AN_EVENT") - Trigger other errors');
      logger.info('DevTools', '🧪 Capture limit dev functions available:');
      logger.info('DevTools', '  - window.__getCaptureCount() - Get current capture count');
      logger.info('DevTools', '  - window.__incrementCaptureCount() - Increment capture count');
      logger.info('DevTools', '  - window.__resetCaptureCount() - Reset capture count to 0');
      logger.info('DevTools', '  - window.__checkLimit() - Check if limit is reached');
      logger.info('DevTools', '🧪 Review prompt dev functions available:');
      logger.info('DevTools', '  - window.__shouldShowReviewPrompt() - Check if review prompt should show');
      logger.info('DevTools', '  - window.__resetReviewPrompt() - Reset review prompt tracking');
      logger.info('DevTools', '  - window.__reviewPromptInfo() - Get review prompt debug info');
      logger.info('DevTools', '');
      logger.info('DevTools', '💡 Testing in-app review:');
      logger.info('DevTools', '  1. Complete 3 captures (or use __incrementCaptureCount() 3 times)');
      logger.info('DevTools', '  2. Close result dialog to return to home');
      logger.info('DevTools', '  3. Review prompt should appear after 1 second');
      logger.info('DevTools', '  4. Click "Yes!" to trigger native review (logs in dev mode)');
      logger.info('DevTools', '  Note: Native dialogs only appear in TestFlight/Production builds');

      return () => {
        // Cleanup on unmount
        delete (window as any).__triggerPaywall;
        delete (window as any).__triggerError;
        delete (window as any).__getCaptureCount;
        delete (window as any).__incrementCaptureCount;
        delete (window as any).__resetCaptureCount;
        delete (window as any).__checkLimit;
        delete (window as any).__shouldShowReviewPrompt;
        delete (window as any).__resetReviewPrompt;
        delete (window as any).__reviewPromptInfo;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Check if user has reached the capture limit
   */
  const checkCaptureLimit = (): boolean => {
    if (!featureFlags) {
      return false; // If feature flags not loaded yet, allow capture
    }
    return hasReachedLimit(featureFlags.free_capture_limit);
  };

  /**
   * Show the paywall sheet
   */
  const showPaywall = (trigger: string = 'manual') => {
    setIsPaywallOpen(true);
    logAnalyticsEvent('paywall_viewed', { trigger });
  };

  return {
    setCapturedImage,
    capturedImage,
    onImportFile: handleFileChange,
    onImport,
    onCaptured,
    paywallSheet: (
      <PaywallSheet
        isOpen={isPaywallOpen}
        onClose={handlePaywallClose}
        onSelectPlan={handleSelectPlan}
        onRestorePurchases={handleRestorePurchases}
        loading={purchaseLoading}
      />
    ),
    checkCaptureLimit,
    showPaywall,
    captureCount: getCaptureCount(),
    purchaseLoading,
  };
};
