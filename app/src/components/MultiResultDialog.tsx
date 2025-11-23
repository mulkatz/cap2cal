import React, { ReactNode } from 'react';
import { CloseButton } from './buttons/CloseButton.tsx';
import { cn } from '../utils.ts';
import EmblaCarousel from './carousel/EmblaCarousel.tsx';
import { IconCheck } from '../assets/icons';

const OPTIONS = { dragFree: false };
const SLIDE_COUNT = 16;
// const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

export const MultiResultDialog = ({
  children,
  onClose,
  closeOnClickOutside = false,
  full,
}: {
  children: ReactNode[];
  onClose?: () => void;
  closeOnClickOutside?: boolean;
  full?: boolean;
}) => {
  return (
    <div
      className={cn('fixed inset-0 z-50 flex max-h-screen items-center justify-center p-6', full && 'magicpattern')}
      onClick={closeOnClickOutside ? onClose : undefined}>
      <div className={'absolute inset-0 bg-gradient-to-t from-black/50 to-black/20'} />
      <div className={'absolute inset-0 flex h-full flex-col'}>
        <EmblaCarousel slides={children} options={OPTIONS} />
        <div className="mb-10 flex w-full items-center justify-center self-end px-4 pb-safe-offset-12">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full border-[4px] border-white/20 shadow-lg"
            onClick={onClose}>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500">
              <IconCheck size={28} strokeWidth={3.5} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
