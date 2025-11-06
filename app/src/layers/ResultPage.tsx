import { cn } from '../utils.ts';
import { ReactNode } from 'react';

interface ResultPageProps {
  children: ReactNode;
  onDone: () => void;
}

export const ResultPage = ({ children, onDone }: ResultPageProps) => {
  return (
    <div className="absolute inset-0 z-30 bg-primary">
      {/* Magic pattern background - same as splash */}
      <div className={'absolute magicpattern inset-0 flex'} />

      {/* Gradient overlay - same as splash */}
      <div
        className={cn(
          'relative w-full h-full inset-0 bg-gradient-to-b to-black/30 from-transparent'
        )}>
      </div>

      {/* Content area for result cards */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <div className="flex-1 flex items-center justify-center w-full overflow-y-auto py-8">
          {children}
        </div>
      </div>
    </div>
  );
};
