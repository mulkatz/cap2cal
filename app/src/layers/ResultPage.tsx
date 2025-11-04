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

        {/* Done button at the bottom */}
        <div className="w-full pb-safe-offset-8 px-4">
          <button
            onClick={onDone}
            className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-sm border border-white/20 text-white py-4 px-8 rounded-full text-lg font-medium hover:bg-white/20 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
