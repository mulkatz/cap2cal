import { cn } from '../../../utils.ts';
import { IconClose } from '../../../assets/icons';
import React from 'react';

interface CloseButtonProps {
  onClick: () => void;
  size?: number;
  className?: string;
}

export const CloseButton = ({ onClick, size = 18, className }: CloseButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn('group box-border flex h-[48px] w-[48px] items-center justify-center text-secondary', className)}>
      <span
        className={cn(
          'flex h-[38px] w-[38px] items-center justify-center rounded-full border-[1px] border-accentElevated bg-primaryElevated',
          'transform transition-all duration-[800ms] group-active:bg-clickHighLight'
        )}>
        <IconClose size={size} />
      </span>
    </button>
  );
};
