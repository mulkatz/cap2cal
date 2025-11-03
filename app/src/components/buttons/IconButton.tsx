import { ReactElement } from 'react';
import { cn } from '../../utils.ts';

export const IconButton = ({
  onClick,
  icon,
  className,
  active,
}: {
  onClick?: () => void;
  icon: ReactElement;
  className?: string;
  active?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'box-border flex h-[48px] items-center justify-center rounded-[5px] border-[1px] border-accentElevated bg-primaryElevated p-3.5 shadow-md',
        { 'bg-highlight text-accentElevated': active },
        'transform transition-all active:bg-clickHighLight',
        className
      )}>
      {icon}
    </button>
  );
};

export const RoundIconButton = ({
  icon,
  className,
  active,
}: {
  onClick?: () => void;
  icon: ReactElement;
  className?: string;
  active?: boolean;
}) => {
  return (
    <button
      className={cn(
        'box-border flex h-[36px] items-center justify-center rounded-full border-[1px] border-secondary bg-primaryElevated p-3.5',
        { 'bg-secondary text-primary': active },
        className
      )}>
      {icon}
    </button>
  );
};
