import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cx.franz.cap2cal',
  appName: 'Cap2Cal',
  webDir: 'dist',
  // server: {
  //   url: 'http://192.168.179.66:9000',
  //   cleartext: true,
  // },
  android: {
    path: './native/android',
  },
  ios: {
    path: './native/ios',
  },
};

export default config;
