/**
 * Image Processing Utilities
 * Functions for image cropping, dimension calculation, and transformation
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface CropDimensions {
  cropWidth: number;
  cropHeight: number;
}

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
export const cropImageToAspectRatio = (
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

      if (imageAspectRatio > targetAspectRatio) {
        sourceWidth = imageHeight * targetAspectRatio;
        sourceX = (imageWidth - sourceWidth) / 2;
      } else if (imageAspectRatio < targetAspectRatio) {
        sourceHeight = imageWidth / targetAspectRatio;
        sourceY = (imageHeight - sourceHeight) / 2;
      }

      const canvas = document.createElement('canvas');
      canvas.width = sourceWidth;
      canvas.height = sourceHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Failed to get canvas context.'));
      }

      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        sourceWidth,
        sourceHeight
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
export const cropBottom = (
  base64Image: string,
  cropHeight: number,
  format: 'image/jpeg' | 'image/png' = 'image/jpeg',
  quality: number = 0.9
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = base64Image;

    image.onload = () => {
      if (cropHeight <= 0) {
        resolve(base64Image);
        return;
      }
      if (cropHeight >= image.height) {
        reject(new Error('Crop height cannot be greater than or equal to the image height.'));
        return;
      }

      const newWidth = image.width;
      const newHeight = image.height - cropHeight;

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context.'));
        return;
      }

      ctx.drawImage(
        image,
        0,
        0,
        newWidth,
        newHeight,
        0,
        0,
        newWidth,
        newHeight
      );

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
export const calculateCropDimensions = (
  imageWidth: number,
  imageHeight: number,
  screenWidth: number,
  screenHeight: number
): CropDimensions => {
  const imageAspectRatio = imageWidth / imageHeight;
  const screenAspectRatio = screenWidth / screenHeight;

  let cropWidth = imageWidth;
  let cropHeight = imageHeight;

  if (imageAspectRatio > screenAspectRatio) {
    cropWidth = imageHeight * screenAspectRatio;
  } else {
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
export const getImageDimensions = (base64Image: string): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = base64Image;

    image.onload = () => {
      resolve({
        width: image.width,
        height: image.height,
      });
    };

    image.onerror = (error) => {
      reject(new Error(`Invalid Base64 string: ${error}`));
    };
  });
};
