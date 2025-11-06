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
        'fixed inset-0 z-50 flex max-h-screen items-center justify-center p-6',
        full && "magicpattern"
      )}
      onClick={closeOnClickOutside ? onClose : undefined}>
      <div className={'absolute inset-0 bg-gradient-to-t from-black/50 to-black/20'}/>
      <div className={'animate-fadeInTranslateY-dont flex max-h-[90%] w-full flex-col'}>
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
        {children}
      </div>
    </div>
  );
};
