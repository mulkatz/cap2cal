import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cx.franz.cap2cal',
  appName: 'Cap2Cal',
  webDir: 'dist',
  android: {
    path: './native/android',
  },
  ios: {
    path: './native/ios',
  },
};

export default config;
