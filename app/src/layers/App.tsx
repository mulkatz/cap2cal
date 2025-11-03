import CameraView2, { CameraRefProps } from './CameraView2.tsx';
import { useDisableOverscroll } from '../hooks/useDisableOverscroll.tsx';
import { SplashView } from './SplashView.tsx';
import { CaptureSheet } from '../components/Sheet.tsx';
import { db } from '../models/db.ts';
import React, { useEffect, useRef, useState } from 'react';
import { DialogStack, useDialogContext } from '../contexts/DialogContext.tsx';
import { useCapture } from '../hooks/useCapture.tsx';
import { useLiveQuery } from 'dexie-react-hooks';
import { Dialog } from '../components/Dialog.tsx';
import { Card } from '../components/Card.group.tsx';
import { Feedback } from '../components/dialogs/Feedback.atom.tsx';
import { initI18n } from '../helper/i18nHelper.ts';
import { IconBulb, IconBurger, IconDownload } from '../assets/icons';
import { MiniButton } from '../components/buttons/MiniButton.tsx';
import { Effects, useEffectContext } from '../contexts/EffectsContext.tsx';
import { cn } from '../utils.ts';
import { Camera, CameraResultType, CameraSource, PermissionStatus } from '@capacitor/camera';
import { PermissionDeniedAtom } from '../components/dialogs/PermissionDenied.atom.tsx';
import { Toaster } from 'react-hot-toast';
import { Capacitor } from '@capacitor/core';
import { CaptureButton } from '../components/buttons/CaptureButton.tsx';

initI18n();

export type AppState = 'splash' | 'loading' | 'home';

const feedbackButtonVisible = false;

export const App = () => {
  const { splash } = useEffectContext();
  useDisableOverscroll();
  const { onImportFile, onCaptured } = useCapture();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [listViewOpen, setListViewOpen] = useState(false);
  const dialogs = useDialogContext();
  const cameraRef = useRef<CameraRefProps>(null);
  const [appState, setAppState] = useState<AppState>('splash');
  const [showFeedback, setShowFeedback] = useState(false);
  const [initialised, setInitialised] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setInitialised(true);
    }, 300);

    return () => {
      setInitialised(false);
    };
  }, []);

  const hasSavedEvents =
    useLiveQuery(async () => {
      return (await db.eventItems.count()) > 0;
    }) || false;

  const onListClick = () => setListViewOpen(!listViewOpen);

  const onFeedBack = () => {
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
      console.error('Error checking permissions', error);
      return false;
    }

    // If permissions are already granted, we're good to go
    if (permissions.camera === 'granted' && permissions.photos === 'granted') {
      return true;
    }

    // If permissions are denied, we can't request them again on some platforms.
    // The user must enable them in the app settings.
    if (permissions.camera === 'denied' || permissions.photos === 'denied') {
      // Optionally, guide the user to their settings
      console.log('Permissions were denied. Please enable them in app settings.');
      return false;
    }

    // If permissions are not determined (prompt), request them.
    try {
      const newPermissions = await Camera.requestPermissions();
      // Return true only if both permissions are granted after the request
      return newPermissions.camera === 'granted' && newPermissions.photos === 'granted';
    } catch (error) {
      console.error('Error requesting permissions', error);
      return false;
    }
  };

  /**
   * A full function to get a photo as a base64 string, including permission handling.
   */
  const getPhotoAsBase64 = async () => {
    // 1. First, check and request permissions
    const permissionsGranted = await checkAndRequestPermissions();

    // 2. If permissions were not granted, stop the function
    if (!permissionsGranted) {
      console.log('Cannot access camera or photos, permission denied.');
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

      console.log('Successfully retrieved base64 image.');
      // Now you can use `imageUrl` or `image.base64String`

      if (!image.base64String) {
        console.error('base64 string was undefined');
        return;
      }
      // await onCaptured('data:image/jpeg;base64,' + image.base64String);
      await onCaptured(imageUrl);
    } catch (error) {
      // This catch block will handle cases where the user cancels the photo picker
      console.error('Error getting photo', error);
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

  const handleCapture = async () => {
    console.log('check permissions', Capacitor.getPlatform());

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
    if (appState === 'splash') {
      setAppState('loading');
      const permission = await ref.requestCameraAccess();
      if ('denied' === permission || 'error' === permission) {
        // toast.error('permission denied');
        setAppState('splash');
        return;
      }

      if ('granted' === permission) {
        const error = await ref.startStream();
        if (error) {
          // toast.error(error.message);
          setAppState('splash');
          return;
        }
      }
      setAppState('home');
      return;
    }

    console.log('capture photo');
    const imgUrl = await ref.capturePhoto();
    if (!imgUrl) {
      // toast.error('Error taking photo');
      return;
    }

    // setCapturedImage('data:image/jpeg;base64,' + imgUrl);
    await onCaptured('data:image/jpeg;base64,' + imgUrl);
  };

  const onStreamCallback = (running: boolean) => {
    console.log('running onStreamCallback', running);
    if (running) setAppState('home');
    else setAppState('splash');
  };

  useEffect(() => {
    if (appState === 'splash' || appState === 'loading') {
      document.body.style.setProperty('background-color', '#000000', 'important');
    } else {
      document.body.style.setProperty('background-color', 'transparent', 'important');
    }
  }, [appState]);

  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === 'visible') {
  //       setAppState('splash');
  //     } else {
  //       setAppState('splash');
  //     }
  //   };
  //
  //   document.addEventListener('visibilitychange', handleVisibilityChange);
  //   return () => {
  //     document.removeEventListener('visibilitychange', handleVisibilityChange);
  //   };
  // }, []);

  // const safeAreaTop = parseInt(
  //   getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)') || '0',
  //   10
  // );
  // console.log('Safe Area Top (px):', safeAreaTop);

  return (
    <main>
      <>
        <div className={'relative flex h-[100vh] w-full flex-col overflow-hidden'}>
          <CameraView2 ref={cameraRef} onStreamCallback={onStreamCallback} />
          {/*<CameraView ref={cameraRef} onStreamCallback={onStreamCallback} />*/}
          {(appState === 'loading' || appState === 'splash') && <SplashView />}

          {/*{capturedImage && (*/}
          {/*  <img className={'absolute inset-0 h-[100vh] object-cover'} src={capturedImage} alt={'captured image'} />*/}
          {/*)}*/}

          <div className={cn('absolute left-0 right-0 z-10 flex justify-center bottom-safe-offset-36')}>
            <CaptureButton onClick={handleCapture} state={appState} />
          </div>

          <MiniButton
            icon={<IconDownload width={34} height={34} />}
            // onClick={() =>(fileInputRef)}
            onClick={getPhotoAsBase64}
            className={'absolute left-[20px] top-[20px]'}
          />

          <MiniButton
            icon={<IconBurger width={34} height={34} />}
            onClick={onListClick}
            className={'absolute right-[20px] top-[20px]'}
            visible={hasSavedEvents}
          />

          <CaptureSheet isOpen={listViewOpen} onClose={() => setListViewOpen(false)} />

          <Toaster position={'top-center'} />
          <Effects />
        </div>
        <DialogStack />

        {feedbackButtonVisible && (
          <MiniButton
            icon={<IconBulb width={30} height={30} />}
            onClick={onFeedBack}
            className={'absolute left-[10px] z-50 bottom-safe-offset-2.5'}
            elevate={false}
          />
        )}
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
