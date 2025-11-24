import { ReactElement } from 'react';
import { cn } from '../../utils.ts';

export const IconButton = ({
  onClick,
  icon,
  className,
  active,
  'data-testid': dataTestId,
}: {
  onClick?: () => void;
  icon: ReactElement;
  className?: string;
  active?: boolean;
  'data-testid'?: string;
}) => {
  return (
    <button
      onClick={onClick}
      data-testid={dataTestId}
      className={cn(
        'box-border flex h-[48px] w-[48px] items-center justify-center rounded-full bg-primaryDark p-3 shadow-md',
        { 'bg-highlight text-primaryDark': active },
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
