import imgHero from '../assets/images/home-hero.png';
import { useAppContext } from '../contexts/AppContext.tsx';
import { IconBulb, IconBurger, IconDownload, IconHeroText } from '../assets/icons';
import React, { useEffect } from 'react';
import { cn } from '../utils.ts';
import { MiniButton } from '../components/buttons/MiniButton.tsx';
import { CaptureSheet } from '../components/Sheet.tsx';

export const SplashView = ({
  onImport,
  onHistory,
  hasSavedEvents,
  isListViewOpen,
  onCloseListViewOpen,
  onFeedback,
  isFeedbackVisible
                           }:{
  onImport: () => void,
  onHistory: () => void,
  hasSavedEvents: boolean,
  isListViewOpen: boolean,
  onCloseListViewOpen: () => void,
  onFeedback: () => void,
  isFeedbackVisible: boolean,
}) => {
  const { version } = useAppContext();

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
          <div className="flex h-full w-3/5 max-w-[320px] flex-col items-center justify-center mb-safe-offset-40">
            <img className={'h-auto w-full object-contain'} src={imgHero} alt="Hero" />
            <IconHeroText width={'100%'} />
          </div>
          <div className={'absolute bottom-0 z-20 ml-auto w-full text-[12px] text-secondary opacity-70'}>
            v{version}
          </div>
        </div>
      </div>

      <MiniButton
        icon={<IconDownload width={34} height={34} />}
        onClick={onImport}
        className={'absolute left-[20px] top-[20px]'}
      />

      <MiniButton
        icon={<IconBurger width={34} height={34} />}
        onClick={onHistory}
        className={'absolute right-[20px] top-[20px]'}
        visible={hasSavedEvents}
      />

      {isFeedbackVisible && (
        <MiniButton
          icon={<IconBulb width={30} height={30} />}
          onClick={onFeedback}
          className={'absolute left-[10px] z-50 bottom-safe-offset-2.5'}
          elevate={false}
        />
      )}

      <CaptureSheet isOpen={isListViewOpen} onClose={onCloseListViewOpen} />
    </>
  );
};
