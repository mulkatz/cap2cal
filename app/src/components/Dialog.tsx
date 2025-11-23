import React, { ReactNode } from 'react';
import { CloseButton } from './buttons/CloseButton.tsx';
import { cn } from '../utils.ts';

export const Dialog = ({
  children,
  onClose,
  closeOnClickOutside = false,
  full,
  noCard = false,
}: {
  children: ReactNode;
  onClose?: () => void;
  closeOnClickOutside?: boolean;
  full?: boolean;
  noCard?: boolean;
}) => {
  return (
    <div
      className={cn('fixed inset-0 z-50 flex max-h-screen items-center justify-center p-6', full && 'magicpattern')}
      onClick={closeOnClickOutside ? onClose : undefined}>
      {/* Premium dark blurred backdrop - enhanced for AI processing state */}
      {!noCard && <div className={'absolute inset-0 bg-black/80 backdrop-blur-md'} />}
      {/*<div*/}
      {/*  className={cn('fixed inset-0 z-50 flex max-h-screen items-center justify-center p-6', full && 'magicpattern')}*/}
      {/*  onClick={closeOnClickOutside ? onClose : undefined}>*/}
      {full && <div className={'absolute inset-0 bg-gradient-to-t from-black/50 to-black/20'} />}

      {/* Premium modal container with smooth fade + scale animation */}
      <div
        className={'flex max-h-[90%] w-full max-w-md animate-premiumModal flex-col'}
        onClick={(e) => e.stopPropagation()}>
        {onClose && (
          <div
            className={'flex w-full items-end justify-end pb-1 pr-0'}
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}>
            <CloseButton onClick={onClose} />
          </div>
        )}

        {/* Conditionally render card wrapper or content directly */}
        {noCard ? (
          children
        ) : (
          <div
            className={cn(
              'relative overflow-hidden rounded-3xl bg-primaryElevated shadow-2xl',
              'border border-white/5'
              // 'backdrop-blur-xl',
              // 'shadow-[0_0_15px_rgba(230,222,77,0.15)]'
            )}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
