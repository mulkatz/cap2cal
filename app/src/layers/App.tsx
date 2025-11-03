import CameraView2, { CameraRefProps } from './CameraView2.tsx';
import { useDisableOverscroll } from '../hooks/useDisableOverscroll.tsx';
import { usePermissions } from '../hooks/usePermissions.tsx';
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
import { cn } from '../utils';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PermissionDeniedAtom } from '../components/dialogs/PermissionDenied.atom.tsx';
import { Toaster } from 'react-hot-toast';
import { CaptureButton } from '../components/buttons/CaptureButton.tsx';

initI18n();

export type AppState = 'splash' | 'loading' | 'home';

const feedbackButtonVisible = false;

export const App = () => {
  const { splash } = useEffectContext();
  useDisableOverscroll();
  const { checkAndRequestCameraPermissions, checkCameraPermission, requestCameraPermission } = usePermissions();
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

  const getPhotoAsBase64 = async () => {
    const permissionsGranted = await checkAndRequestCameraPermissions();

    if (!permissionsGranted) {
      dialogs.replace(
        <Dialog onClose={dialogs.pop}>
          <Card>
            <PermissionDeniedAtom type={'photos'} onClose={dialogs.pop} />
          </Card>
        </Dialog>
      );
      return;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      });

      const imageUrl = `data:image/${image.format};base64,${image.base64String}`;

      if (!image.base64String) {
        return;
      }
      await onCaptured(imageUrl);
    } catch (error) {
      // Error handling
    }
  };

  const handleCapture = async () => {
    const permissions = await checkCameraPermission();
    let cameraPermission = permissions.camera;

    if (cameraPermission === 'prompt' || cameraPermission === 'prompt-with-rationale') {
      const newPermissions = await requestCameraPermission();
      cameraPermission = newPermissions.camera;
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

  return (
    <main>
      <>
        <div className={'relative flex h-[100vh] w-full flex-col overflow-hidden'}>
          <CameraView2 ref={cameraRef} onStreamCallback={onStreamCallback} />
          {(appState === 'loading' || appState === 'splash') && <SplashView />}

          <div className={cn('absolute left-0 right-0 z-10 flex justify-center bottom-safe-offset-36')}>
            <CaptureButton onClick={handleCapture} state={appState} />
          </div>

          <MiniButton
            icon={<IconDownload width={34} height={34} />}
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
