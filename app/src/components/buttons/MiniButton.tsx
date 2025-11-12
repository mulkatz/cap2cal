import { cn } from '../../utils.ts'; // Assuming cn is a utility like clsx or tailwind-merge
import { ReactNode } from 'react';

export const MiniButton = ({
  icon,
  onClick,
  className,
  visible = true,
  elevate = true,
  'data-testid': dataTestId
}: {
  icon: ReactNode;
  onClick: () => void;
  className?: string;
  visible?: boolean;
  elevate?: boolean;
  'data-testid'?: string;
}) => {
  return (
    <button
      onClick={onClick}
      data-testid={dataTestId}
      className={cn(
        'flex cursor-pointer items-center justify-center p-1.5 text-[16px] text-secondary',
        'transform transition-all duration-[300ms] ease-out', // Ensure transform utilities are enabled
        // 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2', // Optional: Added focus styles for accessibility & beauty
        // 'opacity-100 active:text-clickHighLight',
        'opacity-100',
        'rounded-lg border-[2px] bg-gradient-to-t from-[#1f2e3d] to-[#2C4156] text-[16px] text-white shadow-[0_2px_6px_rgba(0.2,0.2,0.2,0.4)]',
        // "cursor-pointer select-none hover:from-[#17759C] hover:to-[#1D95C9]",
        'cursor-pointer select-none',
        'border-[2px] border-white/30',
        {
          // Styles for the elevated and inner shadow look
          'hover:shadow-xl active:translate-y-px active:shadow-md': elevate,
        },
        { 'opacity-0': !visible },
        className
      )}>
      {icon}
    </button>
  );
};
