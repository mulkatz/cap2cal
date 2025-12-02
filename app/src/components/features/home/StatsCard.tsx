import React, { useEffect, useState } from 'react';
import { cn } from '../../../utils';

interface StatsCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  delay?: number; // Animation delay in ms
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, delay = 0, className }) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Animate counter on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 800; // Animation duration
      const steps = 30;
      const increment = value / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <div
      className={cn(
        'group relative flex flex-1 flex-col items-center gap-2 overflow-hidden rounded-2xl border border-white/10 bg-primaryElevated/80 p-4 backdrop-blur-sm transition-all duration-300',
        'hover:border-highlight/30 hover:bg-primaryElevated active:scale-95',
        className
      )}>
      {/* Background pattern - subtle */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(230,222,77,0.1),transparent_50%)]" />
      </div>

      {/* Icon */}
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-highlight/10 text-highlight transition-all duration-300 group-hover:bg-highlight/20 group-hover:scale-110">
        {icon}
      </div>

      {/* Value - Large animated counter */}
      <div className="relative text-3xl font-bold text-white">{displayValue}</div>

      {/* Label */}
      <div className="relative text-xs font-medium uppercase tracking-wider text-gray-400">{label}</div>
    </div>
  );
};
