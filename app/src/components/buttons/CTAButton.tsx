import { cn } from '../../utils.ts';
import { ReactNode } from 'react';
import { ClipLoader } from 'react-spinners';

export const CTAButton = ({
  loading,
  text,
  icon,
  onClick,
  className, // Added missing className to destructuring
  disabled,
  highlight,
  'data-testid': dataTestId
}: {
  loading?: boolean;
  text: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  highlight?: boolean;
  'data-testid'?: string;
}) => {
  // Determine if the button should be considered disabled, either by the prop or by loading state
  // const isDisabled = disabled || loading;

  return (
    <div className={cn('flex w-full gap-2 px-1.5 py-1.5', className)}>
      {' '}
      {/* Applied className to the outer div */}
      <button
        onClick={onClick}
        disabled={disabled} // Pass the disabled state to the button
        data-testid={dataTestId}
        className={cn(
          'flex h-[48px] w-full items-center justify-center rounded-[5px] border-[1px] p-3.5 shadow-md',
          { 'text-[16px] font-bold text-secondary': true },

          // Conditional Styling based on disabled state
          disabled
            ? 'transform cursor-not-allowed border-accentElevated bg-primaryElevated text-secondary/70 transition-all' // Disabled styles
            : 'transform border-accentElevated bg-[#415970] text-secondary transition-all', // Normal/Active styles
          !disabled && highlight && 'bg-yellow-300 text-primaryDark'
        )}>
        {/* Only show the icon if not loading */}
        {!!icon && !loading && icon}

        {/* Loading Spinner */}
        {loading && (
          <div className={'flex h-[48px] w-[48px] items-center justify-center'}>
            {/* Set spinner color based on disabled state or a fixed color */}
            {!highlight ? <ClipLoader color={loading ? '#A0AEC0' : '#FFFFFF'} size={24} /> : <ClipLoader color={loading ? '#192632' : '#FFFFFF'} size={24} />}
          </div>
        )}

        {/* Button Text */}
        {text}
      </button>
    </div>
  );
};
