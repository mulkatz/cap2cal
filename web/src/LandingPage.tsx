import React, { ReactNode, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SeoManager } from './SeoManager.tsx';
import posthog from './posthog';
import AppStoreBadge from './assets/icons/Download_on_the_App_Store_RGB_blk.svg';
import GooglePlayBadge from './assets/icons/Google_Play_Store_badge_EN.svg';

// Icon Components
const IconCamera = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-secondary"
    aria-hidden="true">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const IconCalendar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-secondary"
    aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const IconRobot = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-secondary"
    aria-hidden="true">
    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
    <circle cx="12" cy="5" r="2"></circle>
    <path d="M12 7v4"></path>
    <line x1="8" y1="16" x2="8" y2="16"></line>
    <line x1="16" y1="16" x2="16" y2="16"></line>
  </svg>
);

const IconZap = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-secondary"
    aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const IconGlobe = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-secondary"
    aria-hidden="true">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const IconWifi = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-secondary"
    aria-hidden="true">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
    <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
    <line x1="12" y1="20" x2="12.01" y2="20"></line>
  </svg>
);

const IconLock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-secondary"
    aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const IconHeart = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-secondary"
    aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const IconTicket = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-secondary"
    aria-hidden="true">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
  </svg>
);

const IconShare = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-secondary"
    aria-hidden="true">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const IconCheckCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-green-600"
    aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const IconX = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
    aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconMenu = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
    aria-hidden="true">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

// Placeholder app store URLs - Update these with your actual URLs
const APP_STORE_URL = 'https://apps.apple.com/app/cap2cal/YOUR_APP_ID'; // TODO: Update with actual iOS App Store URL
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=cx.franz.cap2cal'; // TODO: Update with actual Google Play URL

export default function LandingPage(): JSX.Element {
  const { t } = useTranslation('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    if (newState) {
      posthog.capture('mobile_menu_opened');
    }
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleDownloadClick = (platform: 'ios' | 'android', location: string) => {
    posthog.capture('download_button_clicked', { platform, location });
    const url = platform === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;
    window.open(url, '_blank');
  };

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        handleCloseMobileMenu();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const heroTitle = `${t('hero.titleSpan')} ${t('hero.titleMain')}`;

  return (
    <>
      <SeoManager titleValue={heroTitle} titleKey="hero.titleMain" descriptionKey="hero.description" />
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-secondary focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-highlight">
        Skip to main content
      </a>
      <div
        className="relative isolate min-h-screen overflow-x-hidden bg-primaryDark text-left text-secondary"
        style={{ backgroundImage: 'linear-gradient(120deg, #1A2632 0%, #2b3f54 100%)' }}>
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-cardBorder/50 bg-primaryDark/90 backdrop-blur-lg">
          <div className="container mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2 text-2xl font-bold text-secondary">
              <img src="/app-icon.png" alt="Cap2Cal" className="h-8 w-8 rounded-lg" />
              <span className="hidden sm:inline">Cap2Cal</span>
              <span className="sm:hidden">C2C</span>
            </div>
            <nav className="hidden items-center space-x-6 md:flex">
              <a
                href="#features"
                className="font-medium text-secondary/80 transition-colors hover:text-highlight"
                onClick={() => posthog.capture('navigation_clicked', { target: 'features', device: 'desktop' })}>
                {t('nav.features')}
              </a>
              <a
                href="#how-it-works"
                className="font-medium text-secondary/80 transition-colors hover:text-highlight"
                onClick={() => posthog.capture('navigation_clicked', { target: 'how-it-works', device: 'desktop' })}>
                {t('nav.howItWorks')}
              </a>
              <a
                href="#download"
                className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
                onClick={() => posthog.capture('navigation_clicked', { target: 'download', device: 'desktop' })}>
                {t('nav.download')}
              </a>
            </nav>

            <button
              type="button"
              onClick={handleToggleMobileMenu}
              className="flex items-center justify-center rounded-lg p-2 text-secondary/80 transition-colors hover:bg-accent hover:text-highlight md:hidden"
              aria-label="Toggle mobile menu">
              {isMobileMenuOpen ? <IconX /> : <IconMenu />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <>
              <div
                className="fixed bottom-0 left-0 right-0 top-[73px] z-40 bg-black/50 backdrop-blur-sm md:hidden"
                onClick={handleCloseMobileMenu}
                aria-hidden="true"></div>
              <nav className="fixed right-0 top-[73px] z-50 h-[calc(100vh-73px)] w-full max-w-sm animate-slideInRight border-l border-cardBorder bg-primaryDark shadow-2xl md:hidden">
                <div className="flex flex-col space-y-1 p-6">
                  <a
                    href="#features"
                    className="rounded-lg px-4 py-3 font-medium text-secondary/80 transition-colors hover:bg-accent hover:text-highlight"
                    onClick={() => {
                      posthog.capture('navigation_clicked', { target: 'features', device: 'mobile' });
                      handleCloseMobileMenu();
                    }}>
                    {t('nav.features')}
                  </a>
                  <a
                    href="#how-it-works"
                    className="rounded-lg px-4 py-3 font-medium text-secondary/80 transition-colors hover:bg-accent hover:text-highlight"
                    onClick={() => {
                      posthog.capture('navigation_clicked', { target: 'how-it-works', device: 'mobile' });
                      handleCloseMobileMenu();
                    }}>
                    {t('nav.howItWorks')}
                  </a>
                  <a
                    href="#download"
                    className="mt-4 w-full rounded-lg bg-black px-5 py-3 font-semibold text-white transition-transform hover:scale-105 text-center block"
                    onClick={() => {
                      posthog.capture('navigation_clicked', { target: 'download', device: 'mobile' });
                      handleCloseMobileMenu();
                    }}>
                    {t('nav.download')}
                  </a>
                </div>
              </nav>
            </>
          )}
        </header>

        <main id="main-content">
          {/* Hero Section */}
          <section className="container relative mx-auto overflow-hidden px-6 pb-32 pt-24 text-center">
            {/* Hero Visualization */}
            <div className="relative mb-8 flex w-full items-center justify-center">
              <div className="relative flex items-center justify-center gap-3 sm:gap-4">
                {/* Camera Icon */}
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-accentElevated bg-primary shadow-lg sm:h-20 sm:w-20">
                  <svg
                    className="h-8 w-8 text-secondary sm:h-10 sm:w-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>

                {/* Arrow with glow */}
                <div className="relative">
                  <svg
                    className="h-8 w-8 flex-shrink-0 text-highlight drop-shadow-lg sm:h-12 sm:w-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>

                {/* Calendar Icon */}
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-accentElevated bg-primary shadow-lg sm:h-20 sm:w-20">
                  <svg
                    className="h-8 w-8 text-secondary sm:h-10 sm:w-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="relative mb-4 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
              <span className="bg-gradient-to-r from-highlight to-secondary bg-clip-text text-transparent">
                {t('hero.titleSpan')}
              </span>{' '}
              <span className="text-secondary">{t('hero.titleMain')}</span>
            </h1>

            {/* Decorative gradient bar */}
            <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-highlight/50 to-highlight"></div>

            <p className="relative mb-4 text-lg leading-relaxed text-secondary/80 md:text-xl">{t('hero.subtitle')}</p>
            <p className="relative mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-secondary/70 md:text-2xl">
              {t('hero.description')}
            </p>
            <div className="relative flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => handleDownloadClick('ios', 'hero')}
                className="transition-transform hover:scale-105"
                aria-label="Download on the App Store">
                <img src={AppStoreBadge} alt="Download on the App Store" className="h-14" />
              </button>
              <button
                type="button"
                onClick={() => handleDownloadClick('android', 'hero')}
                className="transition-transform hover:scale-105"
                aria-label="Get it on Google Play">
                <img src={GooglePlayBadge} alt="Get it on Google Play" className="h-14" />
              </button>
            </div>
            <p className="relative mt-6 text-sm text-secondary/70">{t('hero.subtext')}</p>
            <p className="relative mt-2 text-sm font-bold uppercase tracking-wide text-highlight">
              {t('hero.trustBadge')}
            </p>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="bg-primary py-24">
            <div className="container mx-auto px-6">
              <h2 className="mb-4 text-center text-4xl font-bold text-secondary">{t('steps.title')}</h2>
              <p className="mb-4 text-center text-xl leading-relaxed text-secondary/70">{t('steps.subtitle')}</p>
              {/* Decorative gradient bar */}
              <div className="mx-auto mb-16 h-1 w-16 rounded-full bg-gradient-to-r from-highlight/50 to-highlight"></div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="group rounded-2xl border-2 border-accentElevated bg-primaryDark p-8 shadow-2xl transition-all duration-200 hover:scale-105 hover:border-highlight/30 hover:shadow-highlight/10">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-highlight/20 to-highlight/5 ring-2 ring-highlight/30">
                      <IconCamera />
                    </div>
                    <div className="bg-gradient-to-br from-highlight to-secondary bg-clip-text text-5xl font-extrabold text-transparent">
                      1.
                    </div>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-secondary">{t('steps.one.title')}</h3>
                  <p className="leading-relaxed text-secondary/70">{t('steps.one.description')}</p>
                </div>
                <div className="group rounded-2xl border-2 border-accentElevated bg-primaryDark p-8 shadow-2xl transition-all duration-200 hover:scale-105 hover:border-highlight/30 hover:shadow-highlight/10">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-highlight/20 to-highlight/5 ring-2 ring-highlight/30">
                      <IconRobot />
                    </div>
                    <div className="bg-gradient-to-br from-highlight to-secondary bg-clip-text text-5xl font-extrabold text-transparent">
                      2.
                    </div>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-secondary">{t('steps.two.title')}</h3>
                  <p className="leading-relaxed text-secondary/70">{t('steps.two.description')}</p>
                </div>
                <div className="group rounded-2xl border-2 border-accentElevated bg-primaryDark p-8 shadow-2xl transition-all duration-200 hover:scale-105 hover:border-highlight/30 hover:shadow-highlight/10">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-highlight/20 to-highlight/5 ring-2 ring-highlight/30">
                      <IconCalendar />
                    </div>
                    <div className="bg-gradient-to-br from-highlight to-secondary bg-clip-text text-5xl font-extrabold text-transparent">
                      3.
                    </div>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-secondary">{t('steps.three.title')}</h3>
                  <p className="leading-relaxed text-secondary/70">{t('steps.three.description')}</p>
                </div>
              </div>
            </div>
          </section>

          {/* App Preview Section */}
          <section className="relative overflow-hidden bg-primary py-24">
            <div className="container mx-auto px-6">
              <div className="flex flex-row items-center gap-20 max-[899px]:flex-col max-[899px]:gap-12 xl:gap-24">
                {/* Left side - Promotional Points */}
                <div className="flex-1 max-w-2xl space-y-8 max-[899px]:order-first max-[899px]:max-w-none">
                  <div>
                    <h2 className="mb-4 text-3xl font-bold leading-tight text-secondary md:text-4xl lg:text-5xl">
                      {t('demo.title')}
                    </h2>
                    <p className="text-base leading-relaxed text-secondary/70 md:text-lg">{t('demo.subtitle')}</p>
                  </div>

                  {/* Promotional Points */}
                  <div className="space-y-5 lg:space-y-6">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-highlight/20 to-highlight/5 ring-2 ring-highlight/30 md:h-12 md:w-12">
                        <IconCheckCircle />
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-bold text-secondary md:text-xl">{t('demo.point1.title')}</h3>
                        <p className="text-sm leading-relaxed text-secondary/70 md:text-base">
                          {t('demo.point1.description')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-highlight/20 to-highlight/5 ring-2 ring-highlight/30 md:h-12 md:w-12">
                        <IconCheckCircle />
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-bold text-secondary md:text-xl">{t('demo.point2.title')}</h3>
                        <p className="text-sm leading-relaxed text-secondary/70 md:text-base">
                          {t('demo.point2.description')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-highlight/20 to-highlight/5 ring-2 ring-highlight/30 md:h-12 md:w-12">
                        <IconCheckCircle />
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-bold text-secondary md:text-xl">{t('demo.point3.title')}</h3>
                        <p className="text-sm leading-relaxed text-secondary/70 md:text-base">
                          {t('demo.point3.description')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-highlight/20 to-highlight/5 ring-2 ring-highlight/30 md:h-12 md:w-12">
                        <IconCheckCircle />
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-bold text-secondary md:text-xl">{t('demo.point4.title')}</h3>
                        <p className="text-sm leading-relaxed text-secondary/70 md:text-base">
                          {t('demo.point4.description')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-highlight/20 to-highlight/5 ring-2 ring-highlight/30 md:h-12 md:w-12">
                        <IconCheckCircle />
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-bold text-secondary md:text-xl">{t('demo.point5.title')}</h3>
                        <p className="text-sm leading-relaxed text-secondary/70 md:text-base">
                          {t('demo.point5.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Device Frame */}
                <div className="flex shrink-0 justify-end max-[899px]:order-last max-[899px]:w-full max-[899px]:justify-center">
                  <div className="relative">
                    {/* Glow effect behind phone */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-[600px] w-[300px] rounded-[60px] bg-gradient-to-b from-highlight/30 via-highlight/10 to-transparent blur-3xl"></div>
                    </div>

                    {/* Mobile Phone Frame */}
                    <div className="relative z-10">
                      <PhoneFrame />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="container mx-auto px-6 py-24">
            <h2 className="mb-4 text-center text-4xl font-bold text-secondary">{t('features.title')}</h2>
            <p className="mb-4 text-center text-xl leading-relaxed text-secondary/70">{t('features.subtitle')}</p>
            {/* Decorative gradient bar */}
            <div className="mx-auto mb-16 h-1 w-16 rounded-full bg-gradient-to-r from-highlight/50 to-highlight"></div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<IconRobot />}
                title={t('features.aiAccuracy.title')}
                description={t('features.aiAccuracy.description')}
              />
              <FeatureCard
                icon={<IconCalendar />}
                title={t('features.universalCalendar.title')}
                description={t('features.universalCalendar.description')}
              />
              <FeatureCard
                icon={<IconZap />}
                title={t('features.lightning.title')}
                description={t('features.lightning.description')}
              />
              <FeatureCard
                icon={<IconGlobe />}
                title={t('features.multiLanguage.title')}
                description={t('features.multiLanguage.description')}
              />
              <FeatureCard
                icon={<IconWifi />}
                title={t('features.offline.title')}
                description={t('features.offline.description')}
              />
              <FeatureCard
                icon={<IconLock />}
                title={t('features.privacy.title')}
                description={t('features.privacy.description')}
              />
              <FeatureCard
                icon={<IconHeart />}
                title={t('features.eventLibrary.title')}
                description={t('features.eventLibrary.description')}
              />
              <FeatureCard
                icon={<IconTicket />}
                title={t('features.tickets.title')}
                description={t('features.tickets.description')}
              />
              <FeatureCard
                icon={<IconShare />}
                title={t('features.sharing.title')}
                description={t('features.sharing.description')}
              />
            </div>
          </section>

          {/* Final CTA Section */}
          <section id="download" className="relative overflow-hidden bg-gradient-to-b from-primaryElevated to-accent py-24">
            <div className="container relative mx-auto px-6 text-center">
              {/* Icon */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-highlight/30 to-highlight/10 shadow-lg shadow-highlight/30 ring-4 ring-highlight/20">
                <svg className="h-10 w-10 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <h2 className="mb-4 text-4xl font-bold text-secondary">{t('finalCta.title')}</h2>
              <p className="mb-4 text-xl leading-relaxed text-secondary/70">{t('finalCta.description')}</p>
              {/* Decorative gradient bar */}
              <div className="mx-auto mb-10 h-1 w-16 rounded-full bg-gradient-to-r from-highlight/50 to-highlight"></div>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleDownloadClick('ios', 'final-cta')}
                  className="transition-transform hover:scale-105"
                  aria-label="Download on the App Store">
                  <img src={AppStoreBadge} alt="Download on the App Store" className="h-14" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadClick('android', 'final-cta')}
                  className="transition-transform hover:scale-105"
                  aria-label="Get it on Google Play">
                  <img src={GooglePlayBadge} alt="Get it on Google Play" className="h-14" />
                </button>
              </div>
              <p className="mt-8 text-sm text-secondary/70">{t('finalCta.trustLine')}</p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-cardBorder/50 bg-primaryDark py-8">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div>
                <div className="mb-4 flex items-center gap-2 text-xl font-bold text-secondary">
                  <img src="/app-icon.png" alt="Cap2Cal" className="h-7 w-7 rounded-lg" />
                  Cap2Cal
                </div>
                <p className="text-sm text-secondary/70">{t('footer.madeWith')}</p>
              </div>
              <div>
                <h3 className="mb-4 font-semibold text-secondary">{t('footer.features')}</h3>
                <ul className="space-y-2 text-sm text-secondary/70">
                  <li>
                    <a href="#features" className="transition-colors hover:text-highlight">
                      {t('nav.features')}
                    </a>
                  </li>
                  <li>
                    <a href="#how-it-works" className="transition-colors hover:text-highlight">
                      {t('nav.howItWorks')}
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 font-semibold text-secondary">{t('footer.support')}</h3>
                <ul className="space-y-2 text-sm text-secondary/70">
                  <li>
                    <a
                      href="mailto:support@cap2cal.app"
                      className="transition-colors hover:text-highlight"
                      onClick={() => posthog.capture('footer_link_clicked', { target: 'contact' })}>
                      {t('footer.contact')}
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 font-semibold text-secondary">{t('footer.legal')}</h3>
                <ul className="space-y-2 text-sm text-secondary/70">
                  <li>
                    <Link
                      to="/terms"
                      className="transition-colors hover:text-highlight"
                      onClick={() => posthog.capture('footer_link_clicked', { target: 'terms' })}>
                      {t('footer.terms')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy"
                      className="transition-colors hover:text-highlight"
                      onClick={() => posthog.capture('footer_link_clicked', { target: 'privacy' })}>
                      {t('footer.privacy')}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-cardBorder/50 pt-6 text-center text-sm text-secondary/60">
              <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

// PhoneFrame component with screenshot carousel
function PhoneFrame(): JSX.Element {
  const [currentScreenshot, setCurrentScreenshot] = useState(0);

  const screenshots = [
    '/screenshots/04_home_screen.png',
    '/screenshots/05_event_list.png',
    '/screenshots/06_event_detail.png',
    '/screenshots/07_capture_loading.png',
    '/screenshots/08_capture_result.png',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreenshot((prev) => (prev + 1) % screenshots.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [screenshots.length]);

  return (
    <div className="relative">
      {/* Phone Frame */}
      <div className="relative mx-auto h-[700px] w-[340px]">
        {/* Phone body with border */}
        <div className="absolute inset-0 rounded-[50px] border-[14px] border-gray-800 bg-gray-900 shadow-2xl">
          {/* Screen area */}
          <div className="relative h-full w-full overflow-hidden rounded-[36px] bg-black">
            {/* Screenshot container with smooth transitions */}
            <div className="relative h-full w-full">
              {screenshots.map((screenshot, index) => (
                <div
                  key={screenshot}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentScreenshot ? 'opacity-100' : 'opacity-0'
                  }`}>
                  <img src={screenshot} alt={`App screenshot ${index + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Power button */}
        <div className="absolute -right-[14px] top-[150px] h-16 w-1 rounded-r-sm bg-gray-800"></div>

        {/* Volume buttons */}
        <div className="absolute -left-[14px] top-[120px] h-12 w-1 rounded-l-sm bg-gray-800"></div>
        <div className="absolute -left-[14px] top-[170px] h-12 w-1 rounded-l-sm bg-gray-800"></div>
      </div>

      {/* Screenshot indicators */}
      <div className="mt-8 flex justify-center gap-2">
        {screenshots.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentScreenshot(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentScreenshot ? 'w-8 bg-highlight' : 'w-2 bg-secondary/30 hover:bg-secondary/50'
            }`}
            aria-label={`View screenshot ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps): JSX.Element {
  return (
    <div className="group rounded-2xl border-2 border-accentElevated bg-primaryDark p-6 shadow-2xl transition-all duration-200 hover:scale-105 hover:border-highlight/30 hover:shadow-highlight/10">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-highlight/20 to-highlight/5 ring-2 ring-highlight/30">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-secondary">{title}</h3>
      <p className="leading-relaxed text-secondary/70">{description}</p>
    </div>
  );
}
