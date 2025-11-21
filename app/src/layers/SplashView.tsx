import imgHero from '../assets/images/home-hero.png';
import { useAppContext } from '../contexts/AppContext.tsx';
import {
  IconBulb,
  IconBurger,
  IconCalendar,
  IconCamera3,
  IconDownload,
  IconGear,
  IconHeroIcon,
  IconHeroText,
  IconImage,
  IconImages,
  IconPlus,
  IconSettings,
} from '../assets/icons';
import React from 'react';
import { cn } from '../utils.ts';
import { MiniButton } from '../components/buttons/MiniButton.tsx';
import { CaptureSheet } from '../components/Sheet.tsx';
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';
import { useRipple } from '../hooks/useRipple.tsx';

export const SplashView = ({
  isLoading,
  onImport,
  onHistory,
  hasSavedEvents,
  isListViewOpen,
  onCloseListViewOpen,
  onFeedback,
  isFeedbackVisible,
  onShowPaywall,
  hasReachedCaptureLimit,
  onSettings,
  onCapture,
}: {
  isLoading: boolean;
  onImport: () => void;
  onHistory: () => void;
  hasSavedEvents: boolean;
  isListViewOpen: boolean;
  onCloseListViewOpen: () => void;
  onFeedback: () => void;
  isFeedbackVisible: boolean;
  onShowPaywall?: (trigger: string) => void;
  hasReachedCaptureLimit?: boolean;
  onSettings: () => void;
  onCapture: () => void;
}) => {
  const { t } = useTranslation();
  const { ripples, addRipple } = useRipple();

  const handleUpgradeClick = () => {
    onShowPaywall?.('upgrade_button_click');
  };

  const handleCaptureClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    addRipple(event);
    onCapture();
  };

  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-primary">
        <div className={'magicpattern absolute inset-0 flex'} />
        <div
          className={cn(
            'relative inset-0 h-full w-full bg-gradient-to-b from-transparent to-black/30'
            // 'bg-[radial-gradient(#444cf7_0.5px,transparent_0.5px)] opacity-80 [background-size:20px_20px]'
          )}></div>
        <div className={'absolute inset-0 flex items-center justify-center'}>
          <div className="mb-[20vh] flex h-full w-3/5 max-w-[320px] flex-col items-center justify-center">
            <IconHeroIcon />
            {/*<img className={'h-auto w-full object-contain'} src={imgHero} alt="Hero" />*/}
            <IconHeroText width={'100%'} />
          </div>
        </div>
      </div>

      {/* Upgrade button - only show when user has reached their capture limit */}
      {hasReachedCaptureLimit && (
        <div className={'absolute left-1/2 top-[34px] flex h-[24px] items-center justify-center'}>
          <button
            onClick={handleUpgradeClick}
            className="pointer-events-auto left-1/2 top-[80px] flex -translate-x-1/2 items-center gap-2 rounded-full border border-highlight bg-primaryElevated px-4 py-2 shadow-lg transition-all">
            <svg className="h-4 w-4 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-semibold text-highlight">{t('dialogs.upgrade.cta')}</span>
          </button>
        </div>
      )}

      <div className={'absolute bottom-[20vh] left-0 right-0 z-10 flex justify-center !overflow-visible'}>
        <button
          onClick={handleCaptureClick}
          className={
            'relative z-50 flex min-w-60 items-center justify-center gap-2 overflow-hidden rounded-full bg-highlight px-6 py-4 text-2xl font-bold text-primary' +
            ' shadow-md shadow-highlight/30' // <-- Add these classes
          }>
          {/* Ripple effects */}
          {ripples.map((ripple) => (
            <span
              key={ripple.key}
              className="absolute animate-ripple rounded-full bg-white/30"
              style={{
                left: ripple.x - ripple.size / 2,
                top: ripple.y - ripple.size / 2,
                width: ripple.size,
                height: ripple.size,
              }}
            />
          ))}

          {isLoading && (
            // <div className={'flex h-[24px] w-[24px] items-center justify-center'}>
            <ClipLoader
              className={'mb-0.5'}
              color={'#1E2E3F'}
              size={28}
              cssOverride={{
                borderWidth: 3,
              }}
            />
            // </div>
          )}
          {!isLoading && <IconCamera3 width={28} height={28} className={'mb-0.5'} />}
          <span>{t('general.capture')}</span>
        </button>
      </div>

      <MiniButton
        icon={<IconImage width={26} height={26} />}
        onClick={onImport}
        className={'absolute left-4 bottom-safe-offset-5'}
        data-testid="import-button"
      />

      <MiniButton
        icon={<IconCalendar width={26} height={26} />}
        onClick={onHistory}
        className={'absolute right-4 bottom-safe-offset-5'}
        visible={hasSavedEvents}
        data-testid="history-button"
      />

      <button
        onClick={onSettings}
        className={
          'absolute right-[10px] flex transform items-center justify-center rounded-[16px] border-[2px] border-transparent bg-primaryElevated/0 p-3 text-[16px] text-secondary/40 opacity-100 transition-all duration-[300ms] ease-out top-safe-offset-0 hover:bg-primaryElevated/50'
        }
        data-testid="settings-button">
        <IconGear width={34} height={34} />
      </button>

      <CaptureSheet isOpen={isListViewOpen} onClose={onCloseListViewOpen} />
    </>
  );
};
