import { Camera, PermissionStatus } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export type PermissionState = 'granted' | 'denied' | 'prompt' | 'prompt-with-rationale' | 'limited' | 'error';

export interface PermissionsResult {
  camera: PermissionState;
  photos?: PermissionState;
}

export const usePermissions = () => {
  const checkAndRequestCameraPermissions = async (): Promise<boolean> => {
    let permissions: PermissionStatus;

    try {
      permissions = await Camera.checkPermissions();
    } catch (error) {
      return false;
    }

    if (permissions.camera === 'granted' && permissions.photos === 'granted') {
      return true;
    }

    if (permissions.camera === 'denied' || permissions.photos === 'denied') {
      return false;
    }

    try {
      const newPermissions = await Camera.requestPermissions();
      return newPermissions.camera === 'granted' && newPermissions.photos === 'granted';
    } catch (error) {
      return false;
    }
  };

  const requestWebCameraPermission = async (): Promise<PermissionState> => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return 'denied';
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      return 'granted';
    } catch (error: any) {
      if (error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError') {
        return 'denied';
      }
      return 'error';
    }
  };

  const checkCameraPermission = async (): Promise<PermissionsResult> => {
    if (Capacitor.getPlatform() === 'web') {
      const webPermission = await requestWebCameraPermission();
      return { camera: webPermission };
    }

    const permissions = await Camera.checkPermissions();
    return {
      camera: permissions.camera,
      photos: permissions.photos,
    };
  };

  const requestCameraPermission = async (): Promise<PermissionsResult> => {
    try {
      const permissions = await Camera.requestPermissions({ permissions: ['camera'] });
      return {
        camera: permissions.camera,
        photos: permissions.photos,
      };
    } catch (error) {
      return { camera: 'error' };
    }
  };

  return {
    checkAndRequestCameraPermissions,
    requestWebCameraPermission,
    checkCameraPermission,
    requestCameraPermission,
  };
};
