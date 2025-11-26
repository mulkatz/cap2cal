/**
 * Platform Utilities
 * Functions for detecting platform, browser, and environment
 */

export function getPlatformAndBrowser() {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  let platformName = 'Unknown';
  if (/android/i.test(userAgent)) {
    platformName = 'Android';
  } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    platformName = 'iOS';
  } else if (/Macintosh|Mac OS X/.test(userAgent)) {
    platformName = 'macOS';
  } else if (/Windows/.test(userAgent)) {
    platformName = 'Windows';
  } else if (/Linux/.test(userAgent)) {
    platformName = 'Linux';
  } else {
    platformName = 'Web';
  }

  let browserName = 'Unknown';
  let browserVersion = 'Unknown';

  if (userAgent.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
    browserVersion = userAgent.match(/Firefox\/([0-9\.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('SamsungBrowser') > -1) {
    browserName = 'Samsung Internet';
    browserVersion = userAgent.match(/SamsungBrowser\/([0-9\.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
    browserName = 'Opera';
    browserVersion = userAgent.match(/Opera|OPR\/([0-9\.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Trident') > -1) {
    browserName = 'Internet Explorer';
    browserVersion = userAgent.match(/rv:([0-9\.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Edge') > -1) {
    browserName = 'Edge';
    browserVersion = userAgent.match(/Edg\/([0-9\.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Chrome') > -1) {
    browserName = 'Chrome';
    browserVersion = userAgent.match(/Chrome\/([0-9\.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Safari') > -1) {
    browserName = 'Safari';
    browserVersion = userAgent.match(/Version\/([0-9\.]+)/)?.[1] || 'Unknown';
  }

  return `${platformName} / ${browserName} / ${browserVersion}`;
}

export function isDevelopmentEnvironment() {
  const url = window.location.href;
  const devPattern = /localhost|--[a-zA-Z0-9_-]+-/;
  return devPattern.test(url);
}

/**
 * Check if developer mode is enabled via environment variable
 * Use this to show/hide developer-specific features like crash testing, debug tools, etc.
 * Set VITE_DEVELOPER_MODE_ENABLED=true in .env to enable
 */
export function isDeveloperModeEnabled(): boolean {
  return import.meta.env.VITE_DEVELOPER_MODE_ENABLED === 'true';
}

export const isApplePlatform = () => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  return /iPhone|iPad|iPod|Macintosh/.test(userAgent);
};
