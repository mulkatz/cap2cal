import React, { ReactNode } from 'react';
import { CloseButton } from './buttons/CloseButton.tsx';
import { cn } from '../utils.ts';

export const Dialog = ({
  children,
  onClose,
  closeOnClickOutside = false,
  full,
  noCard = false
}: {
  children: ReactNode;
  onClose?: () => void;
  closeOnClickOutside?: boolean;
  full?: boolean;
  noCard?: boolean;
}) => {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[60] flex max-h-screen items-center justify-center p-6',
        full && "magicpattern"
      )}
      onClick={closeOnClickOutside ? onClose : undefined}>
      {/* Premium dark blurred backdrop - enhanced for AI processing state */}
      <div className={'absolute inset-0 bg-black/80 backdrop-blur-md'}/>

      {/* Premium modal container with smooth fade + scale animation */}
      <div
        className={'animate-premiumModal flex max-h-[90%] w-full max-w-md flex-col'}
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
          <div className={cn(
            'relative overflow-hidden rounded-3xl bg-primaryElevated shadow-2xl',
            'border border-white/5',
            'backdrop-blur-xl',
            'shadow-[0_0_15px_rgba(230,222,77,0.15)]'
          )}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
