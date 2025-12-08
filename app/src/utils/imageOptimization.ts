import { logger } from './logger';

/**
 * Compresses and resizes an image file before upload.
 * Reduces file size by resizing to max 1920px and compressing to JPEG at 80% quality.
 * @param file The original File object from the input
 * @returns Promise resolving to a base64 string (data:image/jpeg;base64,...)
 */
export const optimizeImageForAI = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const originalSize = file.size;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // 1. Resize Logic: Cap max dimension at 1920px
        // This is optimal for AI vision models (good detail, reasonable size)
        const MAX_DIMENSION = 1920;
        if (width > height) {
          if (width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // 2. Compression Logic: Convert to JPEG at 80% quality
        // This strips metadata and drastically reduces size while maintaining visual quality
        const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.8);

        // Calculate compression stats
        const optimizedSize = Math.round((optimizedBase64.length * 3) / 4); // Approximate byte size
        const compressionRatio = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
        const duration = performance.now() - startTime;

        logger.info('ImageOptimization', 'Image optimized', {
          originalSize: `${(originalSize / 1024 / 1024).toFixed(2)}MB`,
          optimizedSize: `${(optimizedSize / 1024 / 1024).toFixed(2)}MB`,
          compressionRatio: `${compressionRatio}%`,
          originalDimensions: `${img.width}x${img.height}`,
          finalDimensions: `${width}x${height}`,
          duration: `${duration.toFixed(0)}ms`,
        });

        resolve(optimizedBase64);
      };

      img.onerror = (error) => {
        logger.error('ImageOptimization', 'Failed to load image', error instanceof Error ? error : undefined);
        reject(new Error('Failed to load image for optimization'));
      };
    };

    reader.onerror = (error) => {
      logger.error('ImageOptimization', 'Failed to read file', error instanceof Error ? error : undefined);
      reject(new Error('Failed to read file'));
    };
  });
};

/**
 * Optimizes a base64 image string (e.g., from camera capture)
 * Useful when the image is already in base64 format
 * @param base64String The base64 image string
 * @returns Promise resolving to optimized base64 string
 */
export const optimizeBase64Image = (base64String: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const originalSize = Math.round((base64String.length * 3) / 4);

    const img = new Image();
    img.src = base64String;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Resize logic
      const MAX_DIMENSION = 1920;
      if (width > height) {
        if (width > MAX_DIMENSION) {
          height *= MAX_DIMENSION / width;
          width = MAX_DIMENSION;
        }
      } else {
        if (height > MAX_DIMENSION) {
          width *= MAX_DIMENSION / height;
          height = MAX_DIMENSION;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Compress to JPEG
      const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.8);

      const optimizedSize = Math.round((optimizedBase64.length * 3) / 4);
      const compressionRatio = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
      const duration = performance.now() - startTime;

      logger.info('ImageOptimization', 'Base64 image optimized', {
        originalSize: `${(originalSize / 1024 / 1024).toFixed(2)}MB`,
        optimizedSize: `${(optimizedSize / 1024 / 1024).toFixed(2)}MB`,
        compressionRatio: `${compressionRatio}%`,
        originalDimensions: `${img.width}x${img.height}`,
        finalDimensions: `${width}x${height}`,
        duration: `${duration.toFixed(0)}ms`,
      });

      resolve(optimizedBase64);
    };

    img.onerror = (error) => {
      logger.error('ImageOptimization', 'Failed to load base64 image', error instanceof Error ? error : undefined);
      reject(new Error('Failed to load base64 image for optimization'));
    };
  });
};
