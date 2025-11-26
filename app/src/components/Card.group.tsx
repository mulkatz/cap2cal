import React, { ReactNode } from 'react';
import { cn } from '../utils.ts';

interface Props {
  children: ReactNode;
  highlight?: boolean;
  className?: string;
  inline?: boolean;
  usePattern?: boolean;
}

export const Card = ({ children, highlight, className, inline = false, usePattern = false }: Props) => {
  return (
    <div
      className={cn(
        'relative flex flex-col items-start rounded-[20px] bg-primaryDark text-start text-[21px] text-white drop-shadow-lg',
        'transition-all duration-[300ms]',
        'text-secondary',
        { 'max-h-full shrink grow overflow-y-auto': inline },
        className
      )}>
      {children}
    </div>
  );
};
