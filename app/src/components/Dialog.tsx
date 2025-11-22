import React, { ReactNode } from 'react';
import { CloseButton } from './buttons/CloseButton.tsx';
import { cn } from '../utils.ts';

export const Dialog = ({
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
      className={cn(
        'fixed inset-0 z-[60] flex max-h-screen items-center justify-center p-6',
        full && "magicpattern"
      )}
      onClick={closeOnClickOutside ? onClose : undefined}>
      {/* Premium dark blurred backdrop */}
      <div className={'absolute inset-0 bg-black/80 backdrop-blur-sm'}/>

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

        {/* Premium card with glassy effect */}
        <div className={cn(
          'relative overflow-hidden rounded-3xl bg-primaryElevated shadow-2xl',
          'border border-white/5',
          'backdrop-blur-xl'
        )}>
          {children}
        </div>
      </div>
    </div>
  );
};
