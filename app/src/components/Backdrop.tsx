import { cn } from '../utils';

interface BackdropProps {
  isVisible: boolean;
  onClick: () => void;
  className?: string;
}

export const Backdrop = ({ isVisible, onClick, className }: BackdropProps) => {
  return (
    <div
      className={cn(
        'absolute inset-0 z-40 bg-black transition-opacity duration-300 ease-out',
        isVisible ? 'pointer-events-auto opacity-70' : 'pointer-events-none opacity-0',
        className
      )}
      onClick={onClick}
    />
  );
};
