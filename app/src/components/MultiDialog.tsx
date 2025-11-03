import React, { ReactNode } from 'react';
import { CloseButton } from './buttons/CloseButton.tsx';
import { cn } from '../utils.ts';
import EmblaCarousel from './carousel/EmblaCarousel.tsx';

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
      className={cn('fixed inset-0 z-50 flex max-h-screen items-center justify-center bg-black/70 p-6')}
      onClick={closeOnClickOutside ? onClose : undefined}>
      <div className={'animate-fadeInTranslateY-dont flex max-h-[90%] flex-col'}>
        {onClose && (
          <div
            className={'flex w-full items-end justify-end pb-1 pr-5'}
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}>
            <CloseButton onClick={onClose} />
          </div>
        )}
        <EmblaCarousel slides={children} options={OPTIONS} />
      </div>
    </div>
  );
};
