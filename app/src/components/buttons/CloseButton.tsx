import { cn } from '../../utils.ts';
import { IconClose } from '../../assets/icons';
import React from 'react';

export const CloseButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button className={'group box-border flex h-[48px] w-[48px] items-center justify-center text-secondary'}>
      <span
        className={cn(
          'flex h-[38px] w-[38px] items-center justify-center rounded-full border-[1px] border-accentElevated bg-primaryElevated',
          'transform transition-all duration-[800ms] group-active:bg-clickHighLight'
        )}>
        <IconClose size={14} onClick={onClick} />
      </span>
    </button>
  );
};
