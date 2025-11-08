import React, { ReactNode, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SeoManager } from './SeoManager.tsx';
import posthog from './posthog';

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
    className="-mt-1 inline-block text-blue-600"
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
const APP_STORE_URL = "https://apps.apple.com/app/cap2cal/YOUR_APP_ID"; // TODO: Update with actual iOS App Store URL
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=cx.franz.cap2cal"; // TODO: Update with actual Google Play URL

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
      <SeoManager
        titleValue={heroTitle}
        titleKey="hero.titleMain"
        descriptionKey="hero.description"
      />
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
              <span className="text-highlight">
                <IconCalendar />
              </span>
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
              <button
                type="button"
                onClick={() => handleDownloadClick('ios', 'header')}
                className="transform rounded-[5px] border-[1px] border-accentElevated bg-accent px-5 py-2 font-semibold text-secondary shadow-md transition-all hover:scale-105 hover:bg-accentElevated">
                {t('nav.download')}
              </button>
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
                className="fixed left-0 right-0 top-[73px] bottom-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
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
                  <button
                    type="button"
                    onClick={() => {
                      handleDownloadClick('ios', 'mobile-menu');
                      handleCloseMobileMenu();
                    }}
                    className="mt-4 w-full transform rounded-[5px] border-[1px] border-accentElevated bg-accent px-5 py-3 font-semibold text-secondary shadow-md transition-all hover:scale-105 hover:bg-accentElevated">
                    {t('nav.download')}
                  </button>
                </div>
              </nav>
            </>
          )}
        </header>

        <main id="main-content">
          {/* Hero Section */}
          <section className="container relative mx-auto overflow-hidden px-6 pb-32 pt-24 text-center">
            <h1 className="relative mb-2 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
              <span className="bg-gradient-to-r from-highlight to-secondary bg-clip-text text-transparent">
                {t('hero.titleSpan')}
              </span>{' '}
              <span className="text-secondary">{t('hero.titleMain')}</span>
            </h1>
            <p className="relative mb-4 text-lg text-secondary/80 md:text-xl">{t('hero.subtitle')}</p>
            <p className="relative mx-auto mb-10 max-w-3xl text-xl text-secondary/90 md:text-2xl">
              {t('hero.description')}
            </p>
            <div className="relative flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => handleDownloadClick('ios', 'hero')}
                className="transform rounded-[5px] border-[1px] border-accentElevated bg-accent px-10 py-4 text-lg font-semibold text-secondary shadow-md transition-all hover:scale-105 hover:bg-accentElevated">
                {t('hero.cta')}
              </button>
              <button
                type="button"
                onClick={() => handleDownloadClick('android', 'hero')}
                className="transform rounded-[5px] border-[2px] border-cardBorder bg-primaryElevated px-10 py-4 text-lg font-semibold text-secondary transition-all hover:scale-105 hover:bg-accent">
                {t('hero.ctaAndroid')}
              </button>
            </div>
            <p className="relative mt-5 text-sm text-secondary/70">{t('hero.subtext')}</p>
            <p className="relative mt-2 text-sm font-medium text-highlight">{t('hero.trustBadge')}</p>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="bg-primary py-24">
            <div className="container mx-auto px-6">
              <h2 className="mb-4 text-center text-4xl font-bold text-secondary">{t('steps.title')}</h2>
              <p className="mb-16 text-center text-xl text-secondary/80">{t('steps.subtitle')}</p>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="rounded-lg border-[2px] border-cardBorder bg-gradient-to-b from-[#2b3f54] to-[#2b3f54]/50 p-8 shadow-lg">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="rounded-full border border-cardBorder bg-accent p-3">
                      <IconCamera />
                    </div>
                    <div className="bg-gradient-to-br from-highlight to-secondary bg-clip-text text-5xl font-extrabold text-transparent">
                      1.
                    </div>
                  </div>
                  <h3 className="mb-3 text-2xl font-semibold text-secondary">{t('steps.one.title')}</h3>
                  <p className="text-secondary/80">{t('steps.one.description')}</p>
                </div>
                <div className="rounded-lg border-[2px] border-cardBorder bg-gradient-to-b from-[#2b3f54] to-[#2b3f54]/50 p-8 shadow-lg">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="rounded-full border border-cardBorder bg-accent p-3">
                      <IconRobot />
                    </div>
                    <div className="bg-gradient-to-br from-highlight to-secondary bg-clip-text text-5xl font-extrabold text-transparent">
                      2.
                    </div>
                  </div>
                  <h3 className="mb-3 text-2xl font-semibold text-secondary">{t('steps.two.title')}</h3>
                  <p className="text-secondary/80">{t('steps.two.description')}</p>
                </div>
                <div className="rounded-lg border-[2px] border-cardBorder bg-gradient-to-b from-[#2b3f54] to-[#2b3f54]/50 p-8 shadow-lg">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="rounded-full border border-cardBorder bg-accent p-3">
                      <IconCalendar />
                    </div>
                    <div className="bg-gradient-to-br from-highlight to-secondary bg-clip-text text-5xl font-extrabold text-transparent">
                      3.
                    </div>
                  </div>
                  <h3 className="mb-3 text-2xl font-semibold text-secondary">{t('steps.three.title')}</h3>
                  <p className="text-secondary/80">{t('steps.three.description')}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="container mx-auto px-6 py-24">
            <h2 className="mb-4 text-center text-4xl font-bold text-secondary">{t('features.title')}</h2>
            <p className="mb-16 text-center text-xl text-secondary/80">{t('features.subtitle')}</p>
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

          {/* FAQ Section */}
          <section className="bg-primary py-24">
            <div className="container mx-auto px-6">
              <h2 className="mb-16 text-center text-4xl font-bold text-secondary">{t('faq.title')}</h2>
              <div className="mx-auto max-w-3xl space-y-4">
                <FAQItem
                  question={t('faq.q1.question')}
                  answer={t('faq.q1.answer')}
                />
                <FAQItem
                  question={t('faq.q2.question')}
                  answer={t('faq.q2.answer')}
                />
                <FAQItem
                  question={t('faq.q3.question')}
                  answer={t('faq.q3.answer')}
                />
                <FAQItem
                  question={t('faq.q4.question')}
                  answer={t('faq.q4.answer')}
                />
                <FAQItem
                  question={t('faq.q5.question')}
                  answer={t('faq.q5.answer')}
                />
                <FAQItem
                  question={t('faq.q6.question')}
                  answer={t('faq.q6.answer')}
                />
                <FAQItem
                  question={t('faq.q7.question')}
                  answer={t('faq.q7.answer')}
                />
                <FAQItem
                  question={t('faq.q8.question')}
                  answer={t('faq.q8.answer')}
                />
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="bg-gradient-to-b from-primaryElevated to-accent py-24">
            <div className="container mx-auto px-6 text-center">
              <h2 className="mb-4 text-4xl font-bold text-secondary">{t('finalCta.title')}</h2>
              <p className="mb-10 text-xl text-secondary/80">{t('finalCta.description')}</p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleDownloadClick('ios', 'final-cta')}
                  className="transform rounded-[5px] border-[1px] border-highlight bg-highlight px-10 py-4 text-lg font-bold text-primaryDark shadow-md transition-all hover:scale-105 hover:bg-highlight/90">
                  {t('finalCta.cta')}
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadClick('android', 'final-cta')}
                  className="transform rounded-[5px] border-[2px] border-cardBorder px-10 py-4 text-lg font-bold text-secondary transition-all hover:scale-105 hover:bg-primaryElevated">
                  {t('finalCta.ctaAndroid')}
                </button>
              </div>
              <p className="mt-6 text-sm text-secondary/70">{t('finalCta.trustLine')}</p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-cardBorder/50 bg-primaryDark py-8">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div>
                <div className="mb-4 flex items-center gap-2 text-xl font-bold text-secondary">
                  <span className="text-highlight">
                    <IconCalendar />
                  </span>
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
                    <a href="#" className="transition-colors hover:text-highlight">
                      {t('footer.helpCenter')}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition-colors hover:text-highlight">
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

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps): JSX.Element {
  return (
    <div className="rounded-lg border-[2px] border-cardBorder bg-gradient-to-b from-[#2b3f54] to-[#2b3f54]/50 p-6 shadow-lg transition-transform hover:scale-105">
      <div className="mb-4 w-max rounded-full border border-cardBorder bg-accent p-3">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-secondary">{title}</h3>
      <p className="text-secondary/80">{description}</p>
    </div>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border-[2px] border-cardBorder bg-gradient-to-b from-[#2b3f54] to-[#2b3f54]/50 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-accent">
        <span className="font-semibold text-secondary">{question}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''} text-secondary`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="border-t border-cardBorder bg-accent px-6 py-4">
          <p className="text-secondary/80">{answer}</p>
        </div>
      )}
    </div>
  );
}
