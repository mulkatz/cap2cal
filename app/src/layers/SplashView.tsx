import imgHero from '../assets/images/home-hero.png';
import { useAppContext } from '../contexts/AppContext.tsx';
import { IconHeroText } from '../assets/icons';
import { useEffect } from 'react';
import { cn } from '../utils.ts';

export const SplashView = () => {
  const { version } = useAppContext();

  return (
    <div className="pointer-events-none absolute inset-0 bg-primary">
      <div className={'absolute inset-0 '}></div>
        <div className={'absolute magicpattern inset-0 flex'} />
      <div
        className={cn(
          'relative w-full h-full inset-0 bg-gradient-to-b to-black/30 from-transparent'
          // 'bg-[radial-gradient(#444cf7_0.5px,transparent_0.5px)] opacity-80 [background-size:20px_20px]'
        )}>
      </div>
      <div className={'absolute inset-0 flex items-center justify-center'}>
        <div className="flex h-full w-3/5 max-w-[320px] flex-col items-center justify-center mb-safe-offset-40">
          <img className={'h-auto w-full object-contain'} src={imgHero} alt="Hero" />
          <IconHeroText width={'100%'} />
        </div>
        <div className={'absolute bottom-0 z-20 ml-auto w-full text-[12px] text-secondary opacity-70'}>v{version}</div>
      </div>
    </div>
  );
};


