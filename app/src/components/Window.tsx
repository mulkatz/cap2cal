import React, { ReactNode } from 'react';
import { cn } from '../utils.ts';
import { IconClose } from '../assets/icons';

const BackArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

export const Window = ({ children, onClose }: { children: ReactNode; onClose: () => void }) => {
  return (
    <div className="animate-fadeIn fixed z-40 flex h-full w-full flex-col bg-[#080D11] text-white inset-safe">
      {/* Top Navigation Bar */}
      <header className="mb-2 mt-5 flex-shrink-0">
        <div className={'flex w-full justify-end'}>
          <span className={'mr-2'}>
            <button
              onClick={onClose}
              className={cn('group mr-2 box-border flex h-[48px] w-[48px] items-center justify-center text-secondary')}>
              <span
                className={cn(
                  'flex h-[38px] w-[38px] items-center justify-center rounded-full border-[1px] border-accentElevated bg-primaryElevated',
                  'border-[1px] border-secondary',
                  'transform transition-all duration-[800ms] group-active:bg-clickHighLight'
                )}>
                <IconClose width={18} height={18} />
              </span>
            </button>
          </span>
        </div>
        {/*<div className="flex h-14 w-full items-center px-4">*/}
        {/*  <button*/}
        {/*    onClick={onClose}*/}
        {/*    className="rounded-full p-2 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"*/}
        {/*    aria-label="Go back">*/}
        {/*    <BackArrowIcon />*/}
        {/*  </button>*/}
        {/*</div>*/}
      </header>

      {/* Content Area */}
      <main className="mx-6 mb-6 flex-grow overflow-y-auto">{children}</main>
    </div>
  );
};
