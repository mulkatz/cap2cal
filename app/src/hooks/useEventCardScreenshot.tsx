import { useState } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { logger } from '../utils/logger';

export type ScreenshotFormat = 'png' | 'jpeg';

interface UseEventCardScreenshotOptions {
  format?: ScreenshotFormat;
  quality?: number; // 0-1, only for JPEG
  pixelRatio?: number; // Default: 2 for high-quality screenshots
}

interface UseEventCardScreenshotReturn {
  takeScreenshot: (element: HTMLElement) => Promise<string | null>;
  isCapturing: boolean;
  error: Error | null;
}

/**
 * Custom hook to capture screenshots of event card components
 *
 * @param options - Screenshot configuration options
 * @returns Object with takeScreenshot function, loading state, and error
 *
 * @example
 * ```tsx
 * const cardRef = useRef<HTMLDivElement>(null);
 * const { takeScreenshot, isCapturing } = useEventCardScreenshot({ format: 'png' });
 *
 * const handleShare = async () => {
 *   if (cardRef.current) {
 *     const imagePath = await takeScreenshot(cardRef.current);
 *     // Use imagePath for sharing
 *   }
 * };
 * ```
 */
export const useEventCardScreenshot = (
  options: UseEventCardScreenshotOptions = {}
): UseEventCardScreenshotReturn => {
  const { format = 'png', quality = 0.95, pixelRatio = 2 } = options;

  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Takes a screenshot of the provided HTML element and saves it to the device filesystem
   *
   * @param element - The HTML element to capture
   * @returns The file URI of the saved image, or null if failed
   */
  const takeScreenshot = async (element: HTMLElement): Promise<string | null> => {
    if (!element) {
      const err = new Error('No element provided for screenshot');
      setError(err);
      logger.error('useEventCardScreenshot', 'No element provided', err);
      return null;
    }

    setIsCapturing(true);
    setError(null);

    try {
      logger.info('useEventCardScreenshot', `Starting screenshot capture (${format})...`);

      // Capture the element as a data URL
      const dataUrl = format === 'jpeg'
        ? await toJpeg(element, {
            quality,
            pixelRatio,
            cacheBust: true, // Prevent caching issues
          })
        : await toPng(element, {
            pixelRatio,
            cacheBust: true,
          });

      logger.info('useEventCardScreenshot', 'Screenshot captured, preparing to save...');

      // Extract base64 data from data URL
      const base64Data = dataUrl.split(',')[1];

      // Generate filename with timestamp
      const timestamp = Date.now();
      const filename = `event-card-${timestamp}.${format}`;

      // Save to filesystem
      // On native platforms (iOS/Android), save to Cache directory
      // On web, we'll just return the data URL
      const platform = Capacitor.getPlatform();

      if (platform === 'ios' || platform === 'android') {
        const result = await Filesystem.writeFile({
          path: filename,
          data: base64Data,
          directory: Directory.Cache,
        });

        logger.info('useEventCardScreenshot', `Screenshot saved to: ${result.uri}`);
        return result.uri;
      } else {
        // For web platform, return data URL directly
        logger.info('useEventCardScreenshot', 'Running on web, returning data URL');
        return dataUrl;
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error during screenshot');
      setError(error);
      logger.error('useEventCardScreenshot', 'Failed to capture screenshot', error);
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  return {
    takeScreenshot,
    isCapturing,
    error,
  };
};
