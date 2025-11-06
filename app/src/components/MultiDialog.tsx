import React, { ReactNode } from 'react';
import { CloseButton } from './buttons/CloseButton.tsx';
import { cn } from '../utils.ts';
import EmblaCarousel from './carousel/EmblaCarousel.tsx';
import { CTAButton } from './buttons/CTAButton.tsx';
import { IconCheck } from '../assets/icons';
import { useAppContext } from '../contexts/AppContext.tsx';

const OPTIONS = { dragFree: false };
const SLIDE_COUNT = 16;
// const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

export const MultiDialog = ({
  children,
  onClose,
  closeOnClickOutside = false,
}: {
  children: ReactNode[];
  onClose?: () => void;
  closeOnClickOutside?: boolean;
}) => {

  return (
    <div
      className={cn('fixed inset-0 z-50 flex max-h-screen items-center justify-center bg-black/40 p-6')}
      onClick={closeOnClickOutside ? onClose : undefined}>
      <div className={'flex h-full flex-col'}>
        <EmblaCarousel slides={children} options={OPTIONS} />
        <div className="flex w-full items-center justify-center self-end px-4 pb-safe-offset-8">
          <div
            className={'text-clickHighlight rounded-full border-2 border-accentElevated bg-primaryDark p-4'}
            onClick={onClose}>
            <IconCheck width={32} height={32} color={'#00FF00'} />
          </div>
        </div>
      </div>
    </div>
  );
};
