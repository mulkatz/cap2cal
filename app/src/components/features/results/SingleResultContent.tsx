import React, { ReactNode } from 'react';
import { IconCheck } from '../../../assets/icons';

export const SingleResultContent = ({ children, onClose }: { children: ReactNode; onClose?: () => void }) => {
  return (
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
  );
};
