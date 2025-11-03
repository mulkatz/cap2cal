import React, { ReactNode } from 'react';
import { CloseButton } from './buttons/CloseButton.tsx';
import { cn } from '../utils.ts';

export const Dialog = ({
  children,
  onClose,
  closeOnClickOutside = false,
}: {
  children: ReactNode;
  onClose?: () => void;
  closeOnClickOutside?: boolean;
}) => {
  return (
    <div
      className={cn('fixed inset-0 z-50 flex max-h-screen items-center justify-center bg-black/70 p-6')}
      onClick={closeOnClickOutside ? onClose : undefined}>
      <div className={'animate-fadeInTranslateY-dont flex max-h-[90%] w-full flex-col'}>
        {onClose && (
          <div
            className={'flex w-full items-end justify-end pb-1 pr-0'}
            onClick={(event) => {
              // console.log('click');
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
