import { useEffect, useState } from 'react';
import AppStoreBadge from '../assets/icons/Download_on_the_App_Store_RGB_blk.svg';
import GooglePlayBadge from '../assets/icons/Google_Play_Store_badge_EN.svg';

export const DownloadPage = () => {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'web'>('web');
  const [redirecting, setRedirecting] = useState(false);

  const APP_STORE_URL = 'https://apps.apple.com/de/app/capture2calendar/id6754225481';
  const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=cx.franz.cap2cal';

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;

    // Detect platform
    let detectedPlatform: 'ios' | 'android' | 'web' = 'web';
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      detectedPlatform = 'ios';
    } else if (/android/i.test(userAgent)) {
      detectedPlatform = 'android';
    }

    setPlatform(detectedPlatform);

    // Auto-redirect on mobile
    if (detectedPlatform !== 'web') {
      setRedirecting(true);
      const url = detectedPlatform === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;

      setTimeout(() => {
        window.location.href = url;
      }, 1000);
    }
  }, []);

  if (redirecting) {
    return (
      <div
        className="relative flex min-h-screen items-center justify-center bg-primaryDark"
        style={{ backgroundImage: 'linear-gradient(120deg, #1A2632 0%, #2b3f54 100%)' }}>
        <div className="magicpattern pointer-events-none absolute inset-0" aria-hidden="true"></div>
        <div className="relative z-10 rounded-2xl border-2 border-accentElevated bg-primaryElevated p-8 text-center shadow-2xl">
          {/* App Icon */}
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
            <img src="/app-icon.png" alt="Cap2Cal" className="h-20 w-20 rounded-2xl shadow-lg" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-secondary">Cap2Cal</h1>
          <div className="mb-6 inline-block rounded-full bg-gradient-to-br from-highlight/20 to-highlight/5 px-4 py-2 text-sm font-semibold text-highlight ring-2 ring-highlight/30">
            AI-Powered Event Capture
          </div>
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-highlight"></div>
          <p className="text-secondary/70">Redirecting to app store...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-primaryDark p-6"
      style={{ backgroundImage: 'linear-gradient(120deg, #1A2632 0%, #2b3f54 100%)' }}>
      <div className="magicpattern pointer-events-none absolute inset-0" aria-hidden="true"></div>
      <div className="relative z-10 w-full max-w-lg rounded-2xl border-2 border-accentElevated bg-primaryElevated p-10 text-center shadow-2xl">
        {/* App Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          <img src="/app-icon.png" alt="Cap2Cal" className="h-24 w-24 rounded-2xl shadow-lg" />
        </div>

        <h1 className="mb-3 text-4xl font-bold text-secondary">Cap2Cal</h1>

        <div className="mb-6 inline-block rounded-full bg-gradient-to-br from-highlight/20 to-highlight/5 px-5 py-2 text-sm font-semibold text-highlight ring-2 ring-highlight/30">
          AI-Powered Event Capture
        </div>

        {/* Decorative gradient bar */}
        <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-highlight/50 to-highlight"></div>

        <p className="mb-8 text-lg leading-relaxed text-secondary/80">
          Turn any event poster into a calendar entry with AI. Never type event details manually again.
        </p>

        {platform === 'web' ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => window.open(APP_STORE_URL, '_blank')}
                className="transition-transform hover:scale-105"
                aria-label="Download on the App Store">
                <img src={AppStoreBadge} alt="Download on the App Store" className="h-14" />
              </button>
              <button
                type="button"
                onClick={() => window.open(PLAY_STORE_URL, '_blank')}
                className="transition-transform hover:scale-105"
                aria-label="Get it on Google Play">
                <img src={GooglePlayBadge} alt="Get it on Google Play" className="h-14" />
              </button>
            </div>
            <a
              href="/"
              className="mt-6 inline-block rounded-xl border-2 border-accentElevated bg-accent px-8 py-3 font-semibold text-secondary transition-all hover:border-highlight/30 hover:bg-accentElevated">
              Visit Website
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => window.open(platform === 'ios' ? APP_STORE_URL : PLAY_STORE_URL, '_blank')}
              className="transition-transform hover:scale-105"
              aria-label={platform === 'ios' ? 'Download on the App Store' : 'Get it on Google Play'}>
              <img
                src={platform === 'ios' ? AppStoreBadge : GooglePlayBadge}
                alt={platform === 'ios' ? 'Download on the App Store' : 'Get it on Google Play'}
                className="h-14"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
