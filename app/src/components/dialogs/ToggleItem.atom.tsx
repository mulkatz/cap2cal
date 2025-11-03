import { ReactNode } from 'react';
import { cn } from '../../utils.ts';

export const ToggleItem = ({
  text,
  icon,
  highlightColor,
  isHighlight,
  onClick,
}: {
  text: string;
  icon?: ReactNode;
  highlightColor: string;
  isHighlight: boolean;
  onClick?: () => void;
}) => {
  return (
    <div className={'flex w-full gap-2'}>
      <button
        onClick={onClick}
        className={cn(
          'flex h-[48px] w-full items-center justify-center rounded-[5px] border-[1px] border-accentElevated bg-primaryElevated p-3.5 shadow-md',
          { 'text-[13px] font-bold text-secondary': true },
          { 'bg-secondary text-accentElevated': isHighlight }
        )}>
        {!!icon && icon}
        {text}
      </button>
    </div>
  );
};
