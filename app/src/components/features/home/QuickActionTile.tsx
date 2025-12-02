import React from 'react';
import { cn } from '../../../utils';

interface QuickActionTileProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  highlight?: boolean;
  disabled?: boolean;
  badge?: number; // Optional badge count
}

export const QuickActionTile: React.FC<QuickActionTileProps> = ({
  label,
  icon,
  onClick,
  className,
  highlight = false,
  disabled = false,
  badge,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border p-6 transition-all duration-300',
        'active:scale-95',
        disabled && 'cursor-not-allowed opacity-50',
        !disabled && !highlight && 'border-white/10 bg-primaryElevated/60 backdrop-blur-sm hover:border-white/20',
        !disabled && highlight && 'border-highlight/30 bg-primaryElevated/80 hover:border-highlight/50',
        className
      )}>
      {/* Background gradient - subtle */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div
          className={cn(
            'h-full w-full',
            highlight
              ? 'bg-[radial-gradient(circle_at_50%_20%,rgba(230,222,77,0.1),transparent_70%)]'
              : 'bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.05),transparent_70%)]'
          )}
        />
      </div>

      {/* Icon container */}
      <div className="relative">
        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300',
            highlight ? 'bg-highlight/15 text-highlight group-hover:scale-110' : 'bg-white/5 text-white/80 group-hover:scale-110'
          )}>
          {icon}
        </div>

        {/* Badge */}
        {badge !== undefined && badge > 0 && (
          <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-highlight text-xs font-bold text-primaryDark shadow-lg">
            {badge > 99 ? '99+' : badge}
          </div>
        )}
      </div>

      {/* Label */}
      <span
        className={cn(
          'relative text-sm font-semibold',
          highlight ? 'text-highlight' : 'text-white/90 group-hover:text-white'
        )}>
        {label}
      </span>
    </button>
  );
};
