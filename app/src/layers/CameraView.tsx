import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@michaelwolz/camera-preview-lite';
import { getSafeAreaTopHeight } from '../utils.ts';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import { MiniButton } from '../components/buttons/MiniButton.tsx';
import { IconChevronLeft } from '../assets/icons';
import { CaptureButton } from '../components/buttons/CaptureButton.tsx';
import { AppState } from '../contexts/AppContext.tsx';

interface CameraViewProps {
  onStreamCallback?: (running: boolean) => void;
  onClose: () => void;
  appState: AppState;
  handleCapture: () => Promise<void>;
}

export interface CameraRefProps {
  capturePhoto: () => Promise<string | null>;
  requestCameraAccess: () => Promise<'granted' | 'denied' | 'error'>;
  startStream: () => Promise<null | any>;
  stopPreview: () => Promise<void>;
}

const CameraView = forwardRef<CameraRefProps, CameraViewProps>(
  ({ onStreamCallback, onClose, appState, handleCapture }, ref) => {
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

        const croppedDimensions = await getImageDimensions(cropped);
        // console.log('croppedDimensions', JSON.stringify(croppedDimensions));

        // console.log('cropped', cropped);

        // return `${result.value}`;
        return cropped.replace('data:image/jpeg;base64,', '');
        // return originalDataUrl.replace('data:image/jpeg;base64,', '');
      } catch (error) {
        console.error('Error capturing photo:', error);
        return null;
      }
    };

    /**
     * Crops a Base64 image to match a target aspect ratio (e.g., a screen).
     * This performs a "center crop", preserving the maximum image area.
     *
     * @param base64Image The Base64 string of the image to crop.
     * @param targetWidth The width of the target aspect ratio (e.g., screen width).
     * @param targetHeight The height of the target aspect ratio (e.g., screen height).
     * @param quality The quality of the output JPEG image, from 0.0 to 1.0 (default: 0.9).
     * @returns A Promise that resolves with the cropped image as a JPEG Base64 string.
     * @throws An error if the image fails to load or the canvas context cannot be created.
     */
    const cropImageToAspectRatio = (
      base64Image: string,
      targetWidth: number,
      targetHeight: number,
      quality: number = 0.9
    ): Promise<string> => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = base64Image;

        image.onload = () => {
          const imageWidth = image.width;
          const imageHeight = image.height;
          const imageAspectRatio = imageWidth / imageHeight;
          const targetAspectRatio = targetWidth / targetHeight;

          let sourceX = 0;
          let sourceY = 0;
          let sourceWidth = imageWidth;
          let sourceHeight = imageHeight;

          // Compare aspect ratios to determine crop area
          if (imageAspectRatio > targetAspectRatio) {
            // Image is wider than the target, so crop the sides (left and right)
            sourceWidth = imageHeight * targetAspectRatio;
            sourceX = (imageWidth - sourceWidth) / 2;
          } else if (imageAspectRatio < targetAspectRatio) {
            // Image is taller than the target, so crop the top and bottom
            sourceHeight = imageWidth / targetAspectRatio;
            sourceY = (imageHeight - sourceHeight) / 2;
          }
          // If aspect ratios are the same, no crop is needed (source variables are already correct)

          // The new canvas will have the dimensions of the cropped area
          const canvas = document.createElement('canvas');
          canvas.width = sourceWidth;
          canvas.height = sourceHeight;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            return reject(new Error('Failed to get canvas context.'));
          }

          // Draw the cropped portion of the original image onto the canvas
          ctx.drawImage(
            image,
            sourceX, // The X coordinate to start clipping from the source image
            sourceY, // The Y coordinate to start clipping from the source image
            sourceWidth, // The width of the clipped image
            sourceHeight, // The height of the clipped image
            0, // The X coordinate to place the image on the canvas
            0, // The Y coordinate to place the image on the canvas
            sourceWidth, // The width of the image to use on the canvas
            sourceHeight // The height of the image to use on the canvas
          );

          resolve(canvas.toDataURL('image/jpeg', quality));
        };

        image.onerror = (error) => {
          reject(new Error(`Image failed to load: ${error}`));
        };
      });
    };

    /**
     * Crops a specified height from the bottom of a Base64 encoded image.
     *
     * @param base64Image The Base64 string of the source image.
     * @param cropHeight The height in pixels to crop from the bottom.
     * @param format The output format, either 'image/jpeg' or 'image/png'. Defaults to 'image/jpeg'.
     * @param quality The quality for JPEG format, from 0.0 to 1.0. Defaults to 0.9.
     * @returns A Promise that resolves with the new, cropped Base64 image string.
     * @throws An error if the cropHeight is invalid or the image fails to load.
     */
    const cropBottom = (
      base64Image: string,
      cropHeight: number,
      format: 'image/jpeg' | 'image/png' = 'image/jpeg',
      quality: number = 0.9
    ): Promise<string> => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = base64Image;

        image.onload = () => {
          // Validate the crop height
          if (cropHeight <= 0) {
            // If crop height is zero or negative, no crop is needed.
            resolve(base64Image);
            return;
          }
          if (cropHeight >= image.height) {
            reject(new Error('Crop height cannot be greater than or equal to the image height.'));
            return;
          }

          // Calculate the new dimensions
          const newWidth = image.width;
          const newHeight = image.height - cropHeight;

          // Create a canvas with the new dimensions
          const canvas = document.createElement('canvas');
          canvas.width = newWidth;
          canvas.height = newHeight;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Failed to get canvas context.'));
            return;
          }

          // Draw the top portion of the original image onto the canvas
          // This effectively crops the bottom part.
          ctx.drawImage(
            image,
            0, // sourceX
            0, // sourceY
            newWidth, // sourceWidth (the part of the source image we want)
            newHeight, // sourceHeight (the part of the source image we want)
            0, // destinationX
            0, // destinationY
            newWidth, // destinationWidth (how big to draw it on the canvas)
            newHeight // destinationHeight (how big to draw it on the canvas)
          );

          // Export the canvas content to a new Base64 string
          resolve(canvas.toDataURL(format, quality));
        };

        image.onerror = (error) => {
          reject(new Error(`Image failed to load: ${error}`));
        };
      });
    };

    /**
     * Calculates the dimensions of a crop area within an image that matches
     * the aspect ratio of a target screen.
     *
     * @param imageWidth The original width of the image.
     * @param imageHeight The original height of the image.
     * @param screenWidth The width of the target screen.
     * @param screenHeight The height of the target screen.
     * @returns An object containing the width and height of the crop area.
     */
    const calculateCropDimensions = (
      imageWidth: number,
      imageHeight: number,
      screenWidth: number,
      screenHeight: number
    ): { cropWidth: number; cropHeight: number } => {
      const imageAspectRatio = imageWidth / imageHeight;
      const screenAspectRatio = screenWidth / screenHeight;

      let cropWidth = imageWidth;
      let cropHeight = imageHeight;

      if (imageAspectRatio > screenAspectRatio) {
        // Image is wider than the screen, so the crop area's height is the image's height.
        // The crop area's width is then calculated based on the screen's aspect ratio.
        cropWidth = imageHeight * screenAspectRatio;
      } else {
        // Image is taller than (or same as) the screen, so the crop area's width is the image's width.
        // The crop area's height is then calculated based on the screen's aspect ratio.
        cropHeight = imageWidth / screenAspectRatio;
      }

      return { cropWidth, cropHeight };
    };

    /**
     * Gets the dimensions (width and height) of a Base64 encoded image.
     *
     * @param base64Image The Base64 string representation of the image.
     * @returns A Promise that resolves with an object containing the width and height.
     * @throws An error if the image fails to load.
     */
    const getImageDimensions = (base64Image: string): Promise<{ width: number; height: number }> => {
      return new Promise((resolve, reject) => {
        // Create a new Image object
        const image = new Image();

        // Set the image source to the Base64 string
        image.src = base64Image;

        // Define the onload event handler
        image.onload = () => {
          // Resolve the promise with the image's dimensions
          resolve({
            width: image.width,
            height: image.height,
          });
        };

        // Define the onerror event handler
        image.onerror = (error) => {
          // Reject the promise if there's an error loading the image
          reject(new Error(`Invalid Base64 string: ${error}`));
        };
      });
    };

    /**
     * ───────────────────────────────────────────────────────────
     *  Clean up on unmount
     * ───────────────────────────────────────────────────────────
     */
    // useEffect(() => {
    //   App.addListener('appStateChange', ({ isActive }) => {
    //     if(!isActive) {
    //       stopPreview();
    //     }
    //   });
    //
    //   return () => {
    //     // Stop the preview if it's running
    //     if (isPreviewRunning) {
    //       stopPreview();
    //     }
    //   };
    // }, []);

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
        <div className={'absolute left-0 right-0 z-10 flex justify-center bottom-safe-offset-36'}>
          <CaptureButton onClick={handleCapture} state={appState} />
        </div>

        <MiniButton
          icon={<IconChevronLeft width={34} height={34} />}
          onClick={onClose}
          className={'absolute left-[20px] top-[20px]'}
        />
      </>
    );
  }
);

export default CameraView;
