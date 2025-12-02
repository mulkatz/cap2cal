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
      <>
        {/* Aurora Background with Film Grain */}
        <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden" aria-hidden="true">
          {/* Base Dark Background */}
          <div className="absolute inset-0 bg-slate-950"></div>

          {/* Ambient Glows */}
          <div className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-blue-600/20 blur-[300px]"></div>
          <div className="absolute right-0 top-1/2 h-[1000px] w-[1000px] -translate-y-1/2 translate-x-1/4 rounded-full bg-lime-500/10 blur-[300px]"></div>
          <div className="absolute -bottom-1/4 -left-1/4 h-[900px] w-[900px] rounded-full bg-teal-600/20 blur-[300px]"></div>

          {/* Film Grain Texture */}
          <div className="absolute inset-0 opacity-[0.03]"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulance type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                 backgroundRepeat: 'repeat'
               }}>
          </div>
        </div>

        <div className="relative flex min-h-screen items-center justify-center">
          <div className="relative z-10 rounded-2xl border-t border-white/20 border-b border-black/40 border-x border-white/10 bg-slate-900/60 p-8 text-center shadow-2xl backdrop-blur-sm"
               style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            {/* App Icon */}
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
              <img src="/app-icon.png" alt="Cap2Cal" className="h-20 w-20 rounded-2xl shadow-lg" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-white">Cap2Cal</h1>
            <div className="mb-6 inline-block rounded-full bg-lime-400/10 px-4 py-2 text-sm font-semibold text-lime-400 ring-2 ring-lime-400/30">
              AI-Powered Event Capture
            </div>
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-lime-400"></div>
            <p className="text-slate-400">Redirecting to app store...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Aurora Background with Film Grain */}
      <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden" aria-hidden="true">
        {/* Base Dark Background */}
        <div className="absolute inset-0 bg-slate-950"></div>

        {/* Ambient Glows */}
        <div className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-blue-600/20 blur-[300px]"></div>
        <div className="absolute right-0 top-1/2 h-[1000px] w-[1000px] -translate-y-1/2 translate-x-1/4 rounded-full bg-lime-500/10 blur-[300px]"></div>
        <div className="absolute -bottom-1/4 -left-1/4 h-[900px] w-[900px] rounded-full bg-teal-600/20 blur-[300px]"></div>

        {/* Film Grain Texture */}
        <div className="absolute inset-0 opacity-[0.03]"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulance type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
               backgroundRepeat: 'repeat'
             }}>
        </div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-6">
        <div className="relative z-10 w-full max-w-lg rounded-2xl border-t border-white/20 border-b border-black/40 border-x border-white/10 bg-slate-900/60 p-10 text-center shadow-2xl backdrop-blur-sm"
             style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
          {/* App Icon */}
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center">
            <img src="/app-icon.png" alt="Cap2Cal" className="h-24 w-24 rounded-2xl shadow-lg" />
          </div>

          <h1 className="mb-3 text-4xl font-bold text-white">Cap2Cal</h1>

          <div className="mb-6 inline-block rounded-full bg-lime-400/10 px-5 py-2 text-sm font-semibold text-lime-400 ring-2 ring-lime-400/30">
            AI-Powered Event Capture
          </div>

          {/* Decorative gradient bar */}
          <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-lime-400/50 to-lime-400"></div>

          <p className="mb-8 text-lg leading-relaxed text-slate-300">
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
                className="mt-6 inline-block rounded-xl border border-white/10 bg-white/5 px-8 py-3 font-semibold text-white transition-all hover:border-lime-400/30 hover:bg-white/10">
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
    </>
  );
};
