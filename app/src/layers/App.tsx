import CameraView, { CameraRefProps } from './CameraView.tsx';
import { useDisableOverscroll } from '../hooks/useDisableOverscroll.tsx';
import { SplashView } from './SplashView.tsx';
import { db } from '../models/db.ts';
import React, { useEffect, useRef, useState } from 'react';
import { DialogStack, useDialogContext } from '../contexts/DialogContext.tsx';
import { useCapture } from '../hooks/useCapture.tsx';
import { useLiveQuery } from 'dexie-react-hooks';
import { Dialog } from '../components/Dialog.tsx';
import { Card } from '../components/Card.group.tsx';
import { Feedback } from '../components/dialogs/Feedback.atom.tsx';
import { SettingsScreen } from '../components/settings/SettingsScreen.tsx';
import { initI18n } from '../helper/i18nHelper.ts';
import { Effects, useEffectContext } from '../contexts/EffectsContext.tsx';
import { Camera, CameraResultType, CameraSource, PermissionStatus } from '@capacitor/camera';
import { PermissionDeniedAtom } from '../components/dialogs/PermissionDenied.atom.tsx';
import { Toaster } from 'react-hot-toast';
import { Capacitor } from '@capacitor/core';
import { useAppContext } from '../contexts/AppContext.tsx';
import { useFirebaseContext } from '../contexts/FirebaseContext.tsx';
import { AnalyticsEvent, AnalyticsParam } from '../utils/analytics.ts';
import { Onboarding } from '../components/onboarding/Onboarding.tsx';
import { logger } from '../utils/logger';
import { shouldShowReviewPrompt, markReviewPromptShown } from '../utils/reviewPrompt.ts';
import { getCaptureCount } from '../utils/captureLimit.ts';
import { AppLikePrompt } from '../components/dialogs/AppLikePrompt.atom.tsx';
import { InAppReview } from '@capacitor-community/in-app-review';

initI18n();

const isFeedbackVisible = false;

export const App = () => {
  const { splash } = useEffectContext();
  useDisableOverscroll();

  const { appState, setAppState } = useAppContext();
  const { onImportFile, onCaptured, paywallSheet, checkCaptureLimit, showPaywall } = useCapture();
  const { logAnalyticsEvent, setAnalyticsUserProperty, featureFlags, featureFlagsLoading } = useFirebaseContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [listViewOpen, setListViewOpen] = useState(false);
  const dialogs = useDialogContext();
  const cameraRef = useRef<CameraRefProps>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [initialised, setInitialised] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    return localStorage.getItem('hasSeenOnboarding') === 'true';
  });
  const [isShareIntentUser, setIsShareIntentUser] = useState(false);
  const [previousCaptureCount, setPreviousCaptureCount] = useState(() => getCaptureCount());
  const [previousAppState, setPreviousAppState] = useState(appState);
  const [isHandlingCaptureRequest, setIsHandlingCaptureRequest] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setInitialised(true);
    }, 300);

    // Set user properties
    const platform = Capacitor.getPlatform();
    const language = navigator.language;

    setAnalyticsUserProperty('platform', platform);
    setAnalyticsUserProperty('language', language);

    // Track app opened
    logAnalyticsEvent(AnalyticsEvent.APP_OPENED, {
      platform: platform,
      language: language,
    });

    return () => {
      setInitialised(false);
    };
  }, []);

  // Listen for shared images from Android intent
  useEffect(() => {
    const handleSharedImage = async (event: any) => {
      logger.debug('ShareIntent', 'Received shared image event', { event: JSON.stringify(event) });

      try {
        const data = typeof event === 'string' ? JSON.parse(event) : event;
        if (data.imageData) {
          logger.info('ShareIntent', 'Processing shared image from intent');

          // Track share intent entry point
          logAnalyticsEvent(AnalyticsEvent.ENTRY_SHARE_INTENT, {
            [AnalyticsParam.SHARE_INTENT_TYPE]: 'image',
          });

          // Set user property to track that this user came via share intent
          setAnalyticsUserProperty('is_share_intent_user', true);

          // Skip onboarding for share intent users
          setIsShareIntentUser(true);
          if (!hasSeenOnboarding) {
            localStorage.setItem('hasSeenOnboarding', 'true');
            setHasSeenOnboarding(true);
          }

          await onCaptured(data.imageData, 'share');
        }
      } catch (error) {
        logger.error('ShareIntent', 'Error processing shared image', error instanceof Error ? error : undefined);
        // Show user feedback
        dialogs.push(
          <Dialog onClose={dialogs.pop}>
            <Card>
              <div>Failed to process shared image. Please try again.</div>
            </Card>
          </Dialog>
        );
      }
    };

    window.addEventListener('sharedImage', handleSharedImage);

    return () => {
      window.removeEventListener('sharedImage', handleSharedImage);
    };
  }, [onCaptured, logAnalyticsEvent, setAnalyticsUserProperty, hasSeenOnboarding]);

  // Handle in-app review prompt
  useEffect(() => {
    const currentCaptureCount = getCaptureCount();

    // Check if we just returned to home after a state change
    const justReturnedHome = appState === 'home' && previousAppState !== 'home';

    // Check if capture count increased (successful capture)
    const hadSuccessfulCapture = currentCaptureCount > previousCaptureCount;

    // Update tracking states
    setPreviousAppState(appState);
    if (hadSuccessfulCapture) {
      setPreviousCaptureCount(currentCaptureCount);
    }

    // Only proceed if we just returned home after a successful capture
    if (!justReturnedHome || !hadSuccessfulCapture) {
      return;
    }

    // Check if in-app rating is enabled via feature flag
    const isInAppRatingEnabled = featureFlags?.in_app_rating ?? true;
    if (!isInAppRatingEnabled) {
      logger.debug('ReviewPrompt', 'In-app rating disabled via feature flag');
      return;
    }

    // Check if we should show the review prompt
    if (!shouldShowReviewPrompt(currentCaptureCount)) {
      return;
    }

    // Add a short delay before showing the prompt (1 second)
    const timeoutId = setTimeout(() => {
      logger.info('ReviewPrompt', 'Showing app like prompt');

      // Mark as shown
      markReviewPromptShown();

      // Log analytics event
      logAnalyticsEvent(AnalyticsEvent.REVIEW_PROMPT_SHOWN, {
        capture_count: currentCaptureCount,
      });

      // Show the dialog
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
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [appState, previousAppState, previousCaptureCount, featureFlags, logAnalyticsEvent, dialogs]);

  const hasSavedEvents =
    useLiveQuery(async () => {
      return (await db.eventItems.count()) > 0;
    }) || false;

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setHasSeenOnboarding(true);
  };

  /**
   * Handle when user clicks "Yes, I love it!" on the app like prompt
   */
  const handleAppLiked = async () => {
    logger.info('ReviewPrompt', 'User liked the app, triggering native review');

    try {
      // Request native in-app review
      await InAppReview.requestReview();

      // Log success
      logAnalyticsEvent(AnalyticsEvent.NATIVE_REVIEW_TRIGGERED);
      logger.info('ReviewPrompt', 'Native review dialog requested successfully');

      // In development, show a toast since native dialog won't appear
      if (import.meta.env.DEV) {
        const platform = Capacitor.getPlatform();
        logger.info('ReviewPrompt', `[DEV MODE] Native review dialog requested (${platform})`);
        logger.info('ReviewPrompt', '[DEV MODE] In production, this would show the App Store/Play Store review dialog');
      }
    } catch (error) {
      // Log error but don't show to user (native review is best-effort)
      logger.error('ReviewPrompt', 'Failed to trigger native review', error instanceof Error ? error : undefined);
      logAnalyticsEvent(AnalyticsEvent.NATIVE_REVIEW_ERROR, {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * Handle when user clicks "Not really" on the app like prompt
   */
  const handleAppDisliked = () => {
    logger.info('ReviewPrompt', 'User disliked the app, showing feedback dialog');

    // Show feedback dialog
    if (!showFeedback) {
      setShowFeedback(true);

      dialogs.push(
        <Dialog
          onClose={() => {
            dialogs.pop();
            setShowFeedback(false);
          }}>
          <Card>
            <Feedback />
          </Card>
        </Dialog>
      );
    }
  };

  const onHistory = () => setListViewOpen(!listViewOpen);

  const onFeedback = () => {
    if (!showFeedback) {
      setShowFeedback(true);

      // Track feedback dialog opened
      logAnalyticsEvent(AnalyticsEvent.FEEDBACK_OPENED);

      dialogs.push(
        <Dialog
          onClose={() => {
            dialogs.pop();
            setShowFeedback(false);
          }}>
          <Card>
            <Feedback />
          </Card>
        </Dialog>
      );
    }
  };

  const onSettings = () => {
    // Track settings opened
    logAnalyticsEvent(AnalyticsEvent.SETTINGS_OPENED);

    dialogs.push(
      <SettingsScreen
        onClose={() => {
          dialogs.pop();
        }}
      />
    );
  };

  /**
   * Checks camera permissions and requests them if not granted.
   * @returns {Promise<boolean>} - True if permissions are granted, false otherwise.
   */
  const checkAndRequestPermissions = async (): Promise<boolean> => {
    let permissions: PermissionStatus;

    try {
      // Check the current permission status
      permissions = await Camera.checkPermissions();
    } catch (error) {
      logger.error('Permissions', 'Error checking permissions', error instanceof Error ? error : undefined);
      return false;
    }

    // If permissions are already granted, we're good to go
    if (permissions.camera === 'granted' && permissions.photos === 'granted') {
      return true;
    }

    // If permissions are denied, we can't request them again on some platforms.
    // The user must enable them in the app settings.
    if (permissions.camera === 'denied' || permissions.photos === 'denied') {
      logger.warn('Permissions', 'Permissions were denied by user');
      return false;
    }

    // If permissions are not determined (prompt), request them.
    try {
      const newPermissions = await Camera.requestPermissions();
      // Return true only if both permissions are granted after the request
      return newPermissions.camera === 'granted' && newPermissions.photos === 'granted';
    } catch (error) {
      logger.error('Permissions', 'Error requesting permissions', error instanceof Error ? error : undefined);
      return false;
    }
  };

  /**
   * A full function to get a photo as a base64 string, including permission handling.
   */
  const onImport = async () => {
    // Check capture limit before importing from gallery
    if (featureFlags && !featureFlagsLoading) {
      const limitReached = checkCaptureLimit();
      logger.debug('CaptureLimit', `Limit reached: ${limitReached}`);

      if (limitReached) {
        logger.info('CaptureLimit', 'Showing paywall - limit reached on gallery import');
        showPaywall('limit_reached_gallery_click');
        return;
      }
    }

    // 1. First, check and request permissions
    const permissionsGranted = await checkAndRequestPermissions();

    // 2. If permissions were not granted, stop the function
    if (!permissionsGranted) {
      logger.warn('Gallery', 'Cannot access photos - permission denied');
      dialogs.replace(
        <Dialog onClose={dialogs.pop}>
          <Card>
            <PermissionDeniedAtom type={'photos'} onClose={dialogs.pop} />
          </Card>
        </Dialog>
      );
      return;
    }

    // 3. If permissions are granted, proceed to get the photo
    try {
      const image = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.Base64, // Get image as a base64 string
        source: CameraSource.Photos, // Or CameraSource.Camera
      });

      // image.base64String contains the raw base64 data.
      // Prepend the data URI scheme to use it in an <img> tag.
      const imageUrl = `data:image/${image.format};base64,${image.base64String}`;

      if (!image.base64String) {
        logger.error('Gallery', 'Base64 string was undefined');
        return;
      }

      logger.info('Gallery', 'Successfully retrieved image from gallery');

      // Track image selected from gallery
      logAnalyticsEvent(AnalyticsEvent.IMAGE_SELECTED_FROM_GALLERY);

      await onCaptured(imageUrl, 'gallery');
    } catch (error) {
      // This catch block will handle cases where the user cancels the photo picker
      logger.debug(
        'Gallery',
        'User cancelled photo picker or error occurred',
        error instanceof Error ? error : undefined
      );
    }
  };

  /**
   * Asks the user for camera permission without capturing an image.
   * @returns {Promise<boolean>} A promise that resolves to `true` if permission is granted, and `false` otherwise.
   */
  const requestWebCameraPermission = async (): Promise<'granted' | 'denied'> => {
    // Check if the mediaDevices API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('The Media Devices API is not supported by this browser.');
      return 'denied';
    }
    try {
      // This line triggers the browser's permission prompt.
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // IMPORTANT: If permission is granted, stop the stream immediately.
      // This turns off the camera light and releases the camera.

      console.log('stop!!!');
      stream.getTracks().forEach((track) => track.stop());

      console.log('✅ Camera permission granted.');
      return 'granted';
    } catch (error: any) {
      // The user denied permission or another error occurred.
      if (error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError') {
        console.warn('❌ Camera permission was denied by the user.');
      } else {
        console.error('An error occurred while requesting camera permission:', error);
      }
      return 'denied';
    }
  };

  const onHandleCapture = async () => {
    setIsHandlingCaptureRequest(true);
    await handleCapture();
    setIsHandlingCaptureRequest(false);
  };

  const handleCapture = async () => {
    console.log('check permissions', Capacitor.getPlatform());
    // Check capture limit before opening camera
    if (featureFlags && !featureFlagsLoading) {
      const limitReached = checkCaptureLimit();
      console.log(`[Capture Limit] Limit reached: ${limitReached}`);

      if (limitReached) {
        console.log('[Capture Limit] Showing paywall - limit reached');
        showPaywall('limit_reached_camera_click');
        return;
      }
    }

    let cameraPermission = 'denied';

    if (Capacitor.getPlatform() === 'web') {
      cameraPermission = await requestWebCameraPermission();
    } else {
      const permissions = await Camera.checkPermissions();
      cameraPermission = permissions.camera;
    }

    console.log('XXXX permission', cameraPermission);
    if (cameraPermission === 'prompt' || cameraPermission === 'prompt-with-rationale') {
      await Camera.requestPermissions({ permissions: ['camera'] });
      return handleCapture();
    }

    if (cameraPermission === 'denied' || cameraPermission === 'limited') {
      dialogs.replace(
        <Dialog onClose={dialogs.pop}>
          <Card>
            <PermissionDeniedAtom type={'camera'} onClose={dialogs.pop} />
          </Card>
        </Dialog>
      );
      return;
    }

    const ref = cameraRef?.current;
    if (!ref) return;
    if (appState === 'home') {
      setAppState('loading');
      const permission = await ref.requestCameraAccess();
      if ('denied' === permission || 'error' === permission) {
        // toast.error('permission denied');
        setAppState('home');
        return;
      }

      if ('granted' === permission) {
        const error = await ref.startStream();
        if (error) {
          // toast.error(error.message);
          setAppState('home');
          return;
        }
      }

      // Track camera opened
      logAnalyticsEvent(AnalyticsEvent.CAMERA_OPENED);

      setAppState('camera');
      return;
    }

    console.log('capture photo');

    // Track image captured from camera
    logAnalyticsEvent(AnalyticsEvent.IMAGE_CAPTURED);

    const imgUrl = await ref.capturePhoto();
    if (!imgUrl) {
      // toast.error('Error taking photo');
      return;
    }

    // setCapturedImage('data:image/jpeg;base64,' + imgUrl);
    await onCaptured('data:image/jpeg;base64,' + imgUrl, 'camera');
  };

  const onStreamCallback = (running: boolean) => {
    console.log('running onStreamCallback', running);
    if (running) setAppState('camera');
    else setAppState('home');
  };

  useEffect(() => {
    if (appState === 'home' || appState === 'loading') {
      document.body.style.setProperty('background-color', 'black', 'important');
    } else {
      document.body.style.setProperty('background-color', 'transparent', 'important');
    }

    if (appState === 'home') {
      const ref = cameraRef?.current;
      if (!ref) return;
      try {
        ref.stopPreview();
      } catch (e) {
        console.error('Cannot stop camera preview');
      }
    }
  }, [appState]);

  // Show onboarding if user hasn't seen it yet
  if (!hasSeenOnboarding) {
    return (
      <main>
        <Onboarding onComplete={handleOnboardingComplete} />
      </main>
    );
  }

  return (
    <main>
      <>
        <div className={'relative flex h-[100dvh] w-full flex-col overflow-hidden'}>
          <CameraView
            ref={cameraRef}
            onStreamCallback={onStreamCallback}
            handleCapture={handleCapture}
            appState={appState}
            onClose={() => setAppState('home')}
          />

          {(appState === 'loading' || appState === 'home') && (
            <SplashView
              isLoading={isHandlingCaptureRequest}
              onCapture={onHandleCapture}
              hasSavedEvents={hasSavedEvents}
              isListViewOpen={listViewOpen}
              onCloseListViewOpen={() => setListViewOpen(false)}
              onHistory={onHistory}
              onImport={onImport}
              isFeedbackVisible={isFeedbackVisible}
              onFeedback={onFeedback}
              onShowPaywall={showPaywall}
              hasReachedCaptureLimit={checkCaptureLimit()}
              onSettings={onSettings}
            />
          )}

          <Toaster position={'top-center'} />
          <Effects />
        </div>
        <DialogStack />
        {paywallSheet}

        {/*<span className={`absolute left-0 top-0 h-screen w-full -translate-y-[${safeAreaTop}px] bg-red-950`}></span>*/}
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(event) => onImportFile(event, fileInputRef)}
        />
        <span
          className={`pointer-events-none absolute left-0 right-0 z-50 bg-black transition-opacity duration-[900ms] ease-out bottom-safe-offset-0 ${initialised ? 'opacity-0' : 'opacity-100'} `}
        />
      </>
    </main>
  );
};
