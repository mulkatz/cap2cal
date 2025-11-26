import React, { ReactNode } from 'react';
import { cn } from '../utils.ts';
import { IconCheck } from '../assets/icons';

export const SingleResultDialog = ({
  children,
  onClose,
  closeOnClickOutside = false,
  full,
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
      <div className={'absolute inset-0 bg-gradient-to-t from-black/50 to-black/20'} />
      <div className={'absolute inset-0 flex h-full flex-col'}>
        <div className={'my-auto px-6'}>{children}</div>
        <div className="mb-10 flex w-full items-center justify-center self-end px-4 pb-safe-offset-12">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full border-[4px] border-white/20 shadow-lg"
            onClick={onClose}
            data-testid="result-close-button">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500">
              <IconCheck size={28} strokeWidth={4} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
