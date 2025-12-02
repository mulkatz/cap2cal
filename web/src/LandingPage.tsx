import React, { ReactNode, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { SeoManager } from './SeoManager.tsx';
import posthog from './posthog';
import AppStoreBadge from './assets/icons/Download_on_the_App_Store_RGB_blk.svg';
import GooglePlayBadge from './assets/icons/Google_Play_Store_badge_EN.svg';
import {
  Camera,
  Calendar,
  Bot,
  Zap,
  Globe,
  Wifi,
  Lock,
  Heart,
  Ticket,
  Share2,
  CheckCircle,
  X,
  Menu,
} from 'lucide-react';

// Icon Wrapper Components
const IconCamera = () => <Camera size={24} className="text-lime-400" aria-hidden="true" />;
const IconCalendar = () => <Calendar size={24} className="text-lime-400" aria-hidden="true" />;
const IconRobot = () => <Bot size={24} className="text-lime-400" aria-hidden="true" />;
const IconZap = () => <Zap size={24} className="text-lime-400" aria-hidden="true" fill="currentColor" />;
const IconGlobe = () => <Globe size={24} className="text-lime-400" aria-hidden="true" />;
const IconWifi = () => <Wifi size={24} className="text-lime-400" aria-hidden="true" />;
const IconLock = () => <Lock size={24} className="text-lime-400" aria-hidden="true" />;
const IconHeart = () => <Heart size={24} className="text-lime-400" aria-hidden="true" />;
const IconTicket = () => <Ticket size={24} className="text-lime-400" aria-hidden="true" fill="currentColor" />;
const IconShare = () => <Share2 size={24} className="text-lime-400" aria-hidden="true" />;
const IconCheckCircle = () => <CheckCircle size={24} className="h-6 w-6 text-lime-400" aria-hidden="true" />;
const IconX = () => <X size={24} className="h-6 w-6" aria-hidden="true" />;
const IconMenu = () => <Menu size={24} className="h-6 w-6" aria-hidden="true" />;

// App Store URLs
const APP_STORE_URL = 'https://apps.apple.com/de/app/capture2calendar/id6754225481';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=cx.franz.cap2cal';

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
      <div className="relative isolate min-h-screen bg-slate-950 text-left text-secondary">
        {/* Aurora Mesh Gradient Background System */}
        <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden" aria-hidden="true">
          {/* Base Dark Background */}
          <div className="absolute inset-0 bg-slate-950"></div>

          {/* Ambient Glows - Strategic Placement */}
          {/* Glow 1: Top Left - Lighting the header */}
          <div className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-blue-600/20 blur-[300px]"></div>

          {/* Glow 2: Center Right - Highlighting the phone/core feature */}
          <div className="absolute right-0 top-1/2 h-[1000px] w-[1000px] -translate-y-1/2 translate-x-1/4 rounded-full bg-lime-500/10 blur-[300px]"></div>

          {/* Glow 3: Bottom Left - Balancing the footer */}
          <div className="absolute -bottom-1/4 -left-1/4 h-[900px] w-[900px] rounded-full bg-teal-600/20 blur-[300px]"></div>

          {/* Film Grain Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                 backgroundRepeat: 'repeat'
               }}>
          </div>
        </div>
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-cardBorder/50 bg-primaryDark/90 backdrop-blur-lg">
          <div className="container mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2 text-2xl font-extrabold text-secondary">
              <img src="/app-icon.png" alt="Cap2Cal" className="h-8 w-8 rounded-lg" />
              <span className="hidden sm:inline">Capture2Calendar</span>
              <span className="sm:hidden">Cap2Cal</span>
            </div>
            <nav className="hidden items-center space-x-6 md:flex">
              <a
                href="#how-it-works"
                className="font-medium text-secondary/80 transition-colors hover:text-highlight"
                onClick={() => posthog.capture('navigation_clicked', { target: 'how-it-works', device: 'desktop' })}>
                {t('nav.howItWorks')}
              </a>
              <a
                href="#features"
                className="font-medium text-secondary/80 transition-colors hover:text-highlight"
                onClick={() => posthog.capture('navigation_clicked', { target: 'features', device: 'desktop' })}>
                {t('nav.features')}
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
                    href="#how-it-works"
                    className="rounded-lg px-4 py-3 font-medium text-secondary/80 transition-colors hover:bg-accent hover:text-highlight"
                    onClick={() => {
                      posthog.capture('navigation_clicked', { target: 'how-it-works', device: 'mobile' });
                      handleCloseMobileMenu();
                    }}>
                    {t('nav.howItWorks')}
                  </a>
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
                    href="#download"
                    className="mt-4 block w-full rounded-lg bg-black px-5 py-3 text-center font-semibold text-white transition-transform hover:scale-105"
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
          <section className="relative z-10 mx-auto overflow-hidden pb-20 pt-32 text-center">
            <div className="mx-auto max-w-7xl px-6">
            {/* Hero Visualization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative mb-8 flex w-full items-center justify-center">
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
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative mb-8 text-6xl font-extrabold leading-[1.1] tracking-tighter md:text-7xl lg:text-8xl"
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #e5e7eb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
              <span className="bg-gradient-to-r from-lime-400 to-lime-300 bg-clip-text text-transparent"
                    style={{ filter: 'drop-shadow(0 0 15px rgba(132, 204, 22, 0.5))' }}>
                {t('hero.titleSpan')}
              </span>{' '}
              <span>{t('hero.titleMain')}</span>
            </motion.h1>

            {/* Decorative gradient bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mx-auto mb-10 h-1 w-20 rounded-full bg-gradient-to-r from-lime-400/50 to-lime-400"></motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mb-6 text-xl leading-relaxed text-slate-300 md:text-2xl">{t('hero.subtitle')}</motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative mx-auto mb-14 max-w-3xl text-lg leading-relaxed text-slate-400 md:text-xl">
              {t('hero.description')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative mx-auto flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleDownloadClick('ios', 'hero')}
                className="transform transition-transform duration-200 hover:scale-105"
                aria-label="Download on the App Store">
                <img src={AppStoreBadge} alt="Download on the App Store" className="h-14" />
              </button>
              <button
                type="button"
                onClick={() => handleDownloadClick('android', 'hero')}
                className="transform transition-transform duration-200 hover:scale-105"
                aria-label="Get it on Google Play">
                <img src={GooglePlayBadge} alt="Get it on Google Play" className="h-14" />
              </button>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative mt-6 text-sm text-slate-400">{t('hero.subtext')}</motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="relative mt-2 text-sm font-bold uppercase tracking-wide text-lime-400">
              {t('hero.trustBadge')}
            </motion.p>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="relative z-10 py-32">
            <div className="mx-auto max-w-7xl px-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-4 text-center text-4xl font-bold md:text-5xl"
                style={{
                  background: 'linear-gradient(180deg, #ffffff 0%, #94a3b8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>{t('steps.title')}</motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-4 text-center text-xl leading-relaxed text-slate-400">{t('steps.subtitle')}</motion.p>
              {/* Decorative gradient bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mx-auto mb-16 h-1 w-16 rounded-full bg-gradient-to-r from-lime-400/50 to-lime-400"></motion.div>

              <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Process Flow Line (Hidden on Mobile) */}
                <div className="absolute left-0 right-0 top-[60px] -z-10 hidden h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent md:block" aria-hidden="true"></div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="group relative flex h-full flex-col rounded-2xl border-t border-white/20 border-b border-black/40 border-x border-white/10 bg-slate-900/60 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/50 hover:shadow-[0_0_30px_-10px_rgba(132,204,22,0.3)]"
                  style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime-400/10 ring-2 ring-lime-400/30">
                      <IconCamera />
                    </div>
                    <div className="text-5xl font-extrabold text-lime-400">
                      1.
                    </div>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-white">{t('steps.one.title')}</h3>
                  <p className="leading-relaxed text-slate-400">{t('steps.one.description')}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="group relative flex h-full flex-col rounded-2xl border-t border-white/20 border-b border-black/40 border-x border-white/10 bg-slate-900/60 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/50 hover:shadow-[0_0_30px_-10px_rgba(132,204,22,0.3)]"
                  style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime-400/10 ring-2 ring-lime-400/30">
                      <IconRobot />
                    </div>
                    <div className="text-5xl font-extrabold text-lime-400">
                      2.
                    </div>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-white">{t('steps.two.title')}</h3>
                  <p className="leading-relaxed text-slate-400">{t('steps.two.description')}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="group relative flex h-full flex-col rounded-2xl border-t border-white/20 border-b border-black/40 border-x border-white/10 bg-slate-900/60 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/50 hover:shadow-[0_0_30px_-10px_rgba(132,204,22,0.3)]"
                  style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime-400/10 ring-2 ring-lime-400/30">
                      <IconCalendar />
                    </div>
                    <div className="text-5xl font-extrabold text-lime-400">
                      3.
                    </div>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-white">{t('steps.three.title')}</h3>
                  <p className="leading-relaxed text-slate-400">{t('steps.three.description')}</p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* App Preview Section */}
          <section className="relative z-10 overflow-hidden py-32">
            <div className="mx-auto max-w-7xl px-6">
              <div className="flex flex-row items-center gap-20 max-[899px]:flex-col max-[899px]:gap-12 xl:gap-24">
                {/* Left side - Promotional Points */}
                <div className="max-w-2xl flex-1 space-y-8 max-[899px]:order-first max-[899px]:max-w-none">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}>
                    <h2 className="mb-4 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl"
                        style={{
                          background: 'linear-gradient(180deg, #ffffff 0%, #94a3b8 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}>
                      {t('demo.title')}
                    </h2>
                    <p className="text-base leading-relaxed text-slate-400 md:text-lg">{t('demo.subtitle')}</p>
                  </motion.div>

                  {/* Promotional Points */}
                  <div className="space-y-8">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="flex items-start gap-4 md:gap-5">
                      <div className="mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-lime-400/10 ring-2 ring-lime-400/30 md:h-12 md:w-12">
                        <IconCheckCircle />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-bold text-white md:text-xl">{t('demo.point1.title')}</h3>
                        <p className="text-sm leading-relaxed text-slate-400 md:text-base">
                          {t('demo.point1.description')}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="flex items-start gap-4 md:gap-5">
                      <div className="mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-lime-400/10 ring-2 ring-lime-400/30 md:h-12 md:w-12">
                        <IconCheckCircle />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-bold text-white md:text-xl">{t('demo.point2.title')}</h3>
                        <p className="text-sm leading-relaxed text-slate-400 md:text-base">
                          {t('demo.point2.description')}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="flex items-start gap-4 md:gap-5">
                      <div className="mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-lime-400/10 ring-2 ring-lime-400/30 md:h-12 md:w-12">
                        <IconCheckCircle />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-bold text-white md:text-xl">{t('demo.point3.title')}</h3>
                        <p className="text-sm leading-relaxed text-slate-400 md:text-base">
                          {t('demo.point3.description')}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="flex items-start gap-4 md:gap-5">
                      <div className="mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-lime-400/10 ring-2 ring-lime-400/30 md:h-12 md:w-12">
                        <IconCheckCircle />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-bold text-white md:text-xl">{t('demo.point4.title')}</h3>
                        <p className="text-sm leading-relaxed text-slate-400 md:text-base">
                          {t('demo.point4.description')}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="flex items-start gap-4 md:gap-5">
                      <div className="mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-lime-400/10 ring-2 ring-lime-400/30 md:h-12 md:w-12">
                        <IconCheckCircle />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-bold text-white md:text-xl">{t('demo.point5.title')}</h3>
                        <p className="text-sm leading-relaxed text-slate-400 md:text-base">
                          {t('demo.point5.description')}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Right side - Device Frame */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex shrink-0 justify-end max-[899px]:order-last max-[899px]:w-full max-[899px]:justify-center">
                  <div className="relative">
                    {/* Spotlight Effect - Radial Backlight */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-[700px] w-[700px] rounded-full bg-gradient-radial from-white/10 to-transparent blur-3xl"></div>
                    </div>

                    {/* Floor Shadow (Flattened Ellipse) */}
                    <div className="absolute bottom-0 left-1/2 h-[20px] w-[280px] -translate-x-1/2 translate-y-8 rounded-full bg-black/40 blur-2xl"></div>

                    {/* Mobile Phone Frame */}
                    <div className="relative z-10">
                      <PhoneFrame />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="relative z-10 py-32">
            <div className="mx-auto max-w-7xl px-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-4 text-center text-4xl font-bold md:text-5xl"
                style={{
                  background: 'linear-gradient(180deg, #ffffff 0%, #94a3b8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>{t('features.title')}</motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-4 text-center text-xl leading-relaxed text-slate-400">{t('features.subtitle')}</motion.p>
              {/* Decorative gradient bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mx-auto mb-16 h-1 w-16 rounded-full bg-gradient-to-r from-lime-400/50 to-lime-400"></motion.div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                <FeatureCard
                  icon={<IconRobot />}
                  title={t('features.aiAccuracy.title')}
                  description={t('features.aiAccuracy.description')}
                  delay={0.1}
                />
                <FeatureCard
                  icon={<IconCalendar />}
                  title={t('features.universalCalendar.title')}
                  description={t('features.universalCalendar.description')}
                  delay={0.2}
                />
                <FeatureCard
                  icon={<IconZap />}
                  title={t('features.lightning.title')}
                  description={t('features.lightning.description')}
                  delay={0.3}
                />
                <FeatureCard
                  icon={<IconGlobe />}
                  title={t('features.multiLanguage.title')}
                  description={t('features.multiLanguage.description')}
                  delay={0.4}
                />
                <FeatureCard
                  icon={<IconWifi />}
                  title={t('features.offline.title')}
                  description={t('features.offline.description')}
                  delay={0.5}
                />
                <FeatureCard
                  icon={<IconLock />}
                  title={t('features.privacy.title')}
                  description={t('features.privacy.description')}
                  delay={0.6}
                />
                <FeatureCard
                  icon={<IconHeart />}
                  title={t('features.eventLibrary.title')}
                  description={t('features.eventLibrary.description')}
                  delay={0.7}
                />
                <FeatureCard
                  icon={<IconTicket />}
                  title={t('features.tickets.title')}
                  description={t('features.tickets.description')}
                  delay={0.8}
                />
                <FeatureCard
                  icon={<IconShare />}
                  title={t('features.sharing.title')}
                  description={t('features.sharing.description')}
                  delay={0.9}
                />
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section id="download" className="relative z-10 overflow-hidden py-32">
            <div className="relative mx-auto max-w-7xl px-6 text-center">
              {/* Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-lime-400/30 to-lime-400/10 shadow-lg shadow-lime-400/30 ring-4 ring-lime-400/20">
                <svg className="h-10 w-10 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-4 text-4xl font-bold md:text-5xl"
                style={{
                  background: 'linear-gradient(180deg, #ffffff 0%, #94a3b8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>{t('finalCta.title')}</motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-4 text-xl leading-relaxed text-slate-400">{t('finalCta.description')}</motion.p>
              {/* Decorative gradient bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mx-auto mb-10 h-1 w-16 rounded-full bg-gradient-to-r from-lime-400/50 to-lime-400"></motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleDownloadClick('ios', 'final-cta')}
                  className="transform transition-transform duration-200 hover:scale-105"
                  aria-label="Download on the App Store">
                  <img src={AppStoreBadge} alt="Download on the App Store" className="h-14" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadClick('android', 'final-cta')}
                  className="transform transition-transform duration-200 hover:scale-105"
                  aria-label="Get it on Google Play">
                  <img src={GooglePlayBadge} alt="Get it on Google Play" className="h-14" />
                </button>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8 text-sm text-slate-400">{t('finalCta.trustLine')}</motion.p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="relative border-t border-white/10 py-12">
          {/* Giant Watermark */}
          <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 overflow-hidden opacity-[0.02]" aria-hidden="true">
            <p className="text-[10rem] font-bold text-white" style={{ WebkitTextStroke: '2px white', WebkitTextFillColor: 'transparent' }}>
              Capture2Cal
            </p>
          </div>

          <div className="relative mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div>
                <div className="mb-4 flex items-center gap-2 text-xl font-bold text-secondary">
                  <img src="/app-icon.png" alt="Cap2Cal" className="h-7 w-7 rounded-lg" />
                  Cap2Cal
                </div>
                <p className="text-sm text-slate-400">{t('footer.madeWith')}</p>
              </div>
              <div>
                <h3 className="mb-4 font-semibold text-secondary">{t('footer.features')}</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>
                    <a href="#how-it-works" className="transition-colors hover:text-highlight">
                      {t('nav.howItWorks')}
                    </a>
                  </li>
                  <li>
                    <a href="#features" className="transition-colors hover:text-highlight">
                      {t('nav.features')}
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 font-semibold text-secondary">{t('footer.support')}</h3>
                <ul className="space-y-2 text-sm text-slate-400">
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
                <ul className="space-y-2 text-sm text-slate-400">
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
            <div className="mt-8 border-t border-white/5 pt-6 text-center text-sm text-slate-400">
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
    '/screenshots/03_camera_view_1.png',
    '/screenshots/03b_camera_view_3.png',
    '/screenshots/04_capture_loading.png',
    '/screenshots/04a_capture_result_1.png',
    '/screenshots/05_event_history_after_capture_1.png',
    '/screenshots/07_event_history_final.png',
    '/screenshots/08_settings.png',
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
        {/* Phone body with border - Photorealistic Bezel */}
        <div className="absolute inset-0 rounded-[2.5rem] border-[14px] border-slate-950 bg-slate-950 shadow-2xl shadow-black/60">
          {/* Screen area */}
          <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-slate-900">
            {/* Glass Reflection Overlay */}
            <div className="pointer-events-none absolute inset-0 z-10 rounded-[2rem] bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>

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
        <div className="absolute -right-[14px] top-[150px] h-16 w-1 rounded-r-sm bg-slate-950"></div>

        {/* Volume buttons */}
        <div className="absolute -left-[14px] top-[120px] h-12 w-1 rounded-l-sm bg-slate-950"></div>
        <div className="absolute -left-[14px] top-[170px] h-12 w-1 rounded-l-sm bg-slate-950"></div>
      </div>

      {/* Screenshot indicators */}
      <div className="mt-8 flex justify-center gap-2">
        {screenshots.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentScreenshot(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentScreenshot ? 'w-8 bg-lime-400' : 'w-2 bg-slate-600 hover:bg-slate-500'
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
  delay?: number;
}

function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative rounded-2xl border-t border-white/20 border-b border-black/40 border-x border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/50 hover:shadow-[0_0_30px_-10px_rgba(132,204,22,0.3)]"
      style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-lime-400/10 ring-2 ring-lime-400/30">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
      <p className="leading-relaxed text-slate-400">{description}</p>
    </motion.div>
  );
}
