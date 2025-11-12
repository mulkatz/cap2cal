import React, { ReactNode } from 'react';
import { CloseButton } from './buttons/CloseButton.tsx';
import { cn } from '../utils.ts';
import { IconCheck } from '../assets/icons';
import EmblaCarousel from './carousel/EmblaCarousel.tsx';

export const SingleResultDialog = ({
  children,
  onClose,
  closeOnClickOutside = false,
  full
}: {
  children: ReactNode;
  onClose?: () => void;
  closeOnClickOutside?: boolean;
  full?: boolean;
}) => {
  return (
    <div
      className={cn('fixed inset-0 z-50 flex max-h-screen items-center justify-center p-6', full && 'magicpattern')}
      onClick={closeOnClickOutside ? onClose : undefined}
      data-testid="result-dialog">
      <div className={'absolute inset-0 bg-gradient-to-t from-black/50 to-black/20'}/>
      <div className={'absolute inset-0 flex h-full flex-col'}>
        <div className={'my-auto px-6'}>
          {children}
        </div>
        <div className="flex w-full items-center justify-center self-end px-4 pb-safe-offset-12">
          <div
            className={'text-clickHighlight rounded-full border-2 border-accentElevated bg-primaryDark p-4'}
            onClick={onClose}
            data-testid="result-close-button">
            <IconCheck width={32} height={32} color={'#00FF00'} />
          </div>
        </div>
      </div>
    </div>
  );
};
