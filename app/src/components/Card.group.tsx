import React, { ReactNode } from 'react';
import { cn } from '../utils.ts';
import { TextureMultiply } from './TextureMultiply.tsx';

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
        'relative flex flex-col items-start rounded-lg border-[1px] border-accent bg-primaryDark text-start text-[21px] text-white drop-shadow-lg',
        { 'border-highlight': highlight },
        'transition-all duration-[300ms]',
        'pt-[13px] text-secondary',
        { 'max-h-full shrink grow overflow-y-auto': inline },
        // apply pattern here
        className
      )}
      // style={
      //   usePattern
      //     ? {
      //         backgroundImage: `url(${pattern2})`,
      //         backgroundSize: 'cover', // Or 'contain', 'auto', etc.
      //         backgroundRepeat: 'repeat', // Set to 'no-repeat' if you only want it once
      //         backgroundPosition: 'center', // Adjust based on your design needs
      //       }
      //     : undefined
      // }
    >
      {/*<TextureMultiply opacity={highlight ? 0.1 : 0.04} />*/}
      {children}
    </div>
  );
};
