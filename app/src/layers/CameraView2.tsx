import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@michaelwolz/camera-preview-lite';
import { getSafeAreaTopHeight } from '../utils.ts';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import {
  cropImageToAspectRatio,
  calculateCropDimensions,
  getImageDimensions,
} from '../utils/imageProcessing.ts';

interface CameraViewProps {
  onStreamCallback?: (running: boolean) => void;
}

export interface CameraRefProps {
  capturePhoto: () => Promise<string | null>;
  requestCameraAccess: () => Promise<'granted' | 'denied' | 'error'>;
  startStream: () => Promise<null | any>;
  stopPreview: () => Promise<void>;
}

const CameraView2 = forwardRef<CameraRefProps, CameraViewProps>(({ onStreamCallback }, ref) => {
  const [isPreviewRunning, setIsPreviewRunning] = useState(false);

  // start when coming back from external link
  useEffect(() => {
    const handleVisibilityChange = () => {
      console.log('visibilitychange', document.hidden, isPreviewRunning);

      if (!document.hidden && isPreviewRunning) {
        startStream();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPreviewRunning]); // <--- Add the dependency here

  /**
   * ───────────────────────────────────────────────────────────
   *  Expose functions to parent via ref
   * ───────────────────────────────────────────────────────────
   */
  useImperativeHandle(ref, () => ({
    capturePhoto: async () => capturePhoto(),
    requestCameraAccess: async () => requestCameraAccess(),
    startStream: async () => startStream(),
    stopPreview: async () => stopPreview(),
  }));

  /**
   * ───────────────────────────────────────────────────────────
   *  1) Request Camera Permission
   * ───────────────────────────────────────────────────────────
   */
  const requestCameraAccess = async (): Promise<'granted' | 'denied' | 'error'> => {
    try {
      // Request permission from the Camera Preview plugin
      // const result = await CameraPreview.requestPermissions();
      /**
       * result: { camera: 'granted'|'denied', photos?: 'granted'|'denied' }
       */

      return 'granted';
      // if (result.camera === 'granted') {
      //   console.log('Camera access granted');
      //   return 'granted';
      // } else {
      //   console.log('Camera access denied');
      //   return 'denied';
      // }
    } catch (error) {
      console.error('Error requesting camera access:', error);
      return 'error';
    }
  };

  /**
   * ───────────────────────────────────────────────────────────
   *  2) Start the Camera Preview ("startStream")
   * ───────────────────────────────────────────────────────────
   *
   *  This is analogous to your original "startStream" method,
   *  but here we start the native camera preview behind the web view.
   * ───────────────────────────────────────────────────────────
   */
  const startStream = async (): Promise<null | any> => {
    try {
      // If the preview is already running, stop it first
      if (isPreviewRunning) {
        await stopPreview();
      }

      // Attempt to start with the rear camera; if it fails, fallback to front
      try {
        await startPreview('rear');
      } catch (rearError) {
        console.warn('Back-facing camera not available, falling back to front-facing camera.', rearError);
        await startPreview('front');
      }

      // If successful, trigger callback
      if (onStreamCallback) {
        onStreamCallback(true);
      }
      return null; // Return null on success
    } catch (error) {
      console.error('Error starting camera preview:', error);
      // If there's an error, notify parent
      if (onStreamCallback) {
        onStreamCallback(false);
      }
      return error;
    }
  };

  /**
   * Helper to actually start the camera with the given position (front or rear)
   */
  const startPreview = async (position: 'front' | 'rear') => {
    console.log('start preview');
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const safeAreaTop = getSafeAreaTopHeight();
    const safeAreaTopPx = parseFloat(safeAreaTop);

    const options: CameraPreviewOptions = {
      position,
      parent: 'cameraPreview', // The DOM element id where preview is rendered
      className: 'camera-preview', // Optional class name
      enableHighResolution: true,
      // width: screenWidth,
      // height: screenHeight - safeAreaTopPx,
      toBack: true,

      y: safeAreaTopPx,
    };

    await CameraPreview.start(options);
    setIsPreviewRunning(true);
  };

  /**
   * ───────────────────────────────────────────────────────────
   *  3) Stop the Camera Preview
   * ───────────────────────────────────────────────────────────
   */
  const stopPreview = async () => {
    console.log('call stopPreview');

    try {
      await CameraPreview.stop();
    } catch (error) {
      console.warn('No active camera preview to stop.', error);
    } finally {
      setIsPreviewRunning(false);
    }
  };

  /**
   * ───────────────────────────────────────────────────────────
   *  4) Capture a photo
   * ───────────────────────────────────────────────────────────
   *
   *  Returns a base64-encoded string you can use as an <img src="...">.
   */
  const capturePhoto = async (): Promise<string | null> => {
    try {
      if (Capacitor.getPlatform() === 'android') {
        await Haptics.impact({ style: ImpactStyle.Light });
      }
      const safeAreaTop = getSafeAreaTopHeight();
      const safeAreaTopPx = parseFloat(safeAreaTop);

      const width = window.innerWidth;
      const height = window.innerHeight;

      console.log('call capture with', width, height);

      const options: CameraPreviewPictureOptions = {
        quality: 85,

        // @ts-ignore
        enableHighResolution: true,
        // width,
        // width,
        // height,
      };
      const originalCaptureImage = await CameraPreview.capture(options);
      // console.log('git image', originalCaptureImage.value);

      const originalDataUrl = `data:image/jpeg;base64,${originalCaptureImage.value}`;
      const originalDimensions = await getImageDimensions(originalDataUrl);

      const cropHeightFactor = height / window.innerHeight;

      console.log('crop height factor:', cropHeightFactor);
      // const bottomCroppedImage = await cropBottom(originalDataUrl, 1);
      // const bottomCroppedDimensions = await getImageDimensions(bottomCroppedImage);
      //
      // const targetDimensions = calculateCropDimensions(
      //   bottomCroppedDimensions.width,
      //   bottomCroppedDimensions.height,
      //   width,
      //   height
      // );

      // console.log('targetDimensions', targetDimensions);
      //
      // const cropped = await cropImageToAspectRatio(
      //   `${bottomCroppedImage}`,
      //   targetDimensions.cropWidth,
      //   targetDimensions.cropHeight
      // );
      // console.log('cropped', cropped);

      console.log('safe area top', safeAreaTopPx);

      const targetDimensions = calculateCropDimensions(
        originalDimensions.width,
        originalDimensions.height,
        width,
        height - safeAreaTopPx
      );

      // console.log('screen Dimensions', width, height);
      // console.log('originalDimension', JSON.stringify(originalDimensions));
      // console.log('targetDimensions', JSON.stringify(targetDimensions));

      const cropped = await cropImageToAspectRatio(
        `${originalDataUrl}`,
        targetDimensions.cropWidth,
        targetDimensions.cropHeight
      );

      return cropped.replace('data:image/jpeg;base64,', '');
    } catch (error) {
      console.error('Error capturing photo:', error);
      return null;
    }
  };


  /**
   * ───────────────────────────────────────────────────────────§
   *  Render
   * ───────────────────────────────────────────────────────────
   *
   *  The camera preview runs natively behind this element.
   *  You won't see an <video> or <canvas> from the plugin.
   *  Instead, it’s rendered "behind" the webview.
   * ───────────────────────────────────────────────────────────
   */
  return (
    <>
      {/* This container is where the plugin attaches the preview behind your web UI.
            You can position it or style it with Tailwind or CSS classes as you wish. */}
      <span className={'pt-safe'} />
      <div id="cameraPreview" className="absolute inset-0 [&>*]:h-screen [&>*]:object-cover" />
      {!isPreviewRunning && <div className="absolute inset-0 z-0 bg-black" />}
    </>
  );
});

export default CameraView2;
