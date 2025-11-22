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
    <button
      onClick={onClick}
      disabled={disabled} // Pass the disabled state to the button
      data-testid={dataTestId}
      className={cn(
        'flex h-[42px] w-full items-center justify-center gap-1.5 rounded-full px-4 py-2 shadow-md',
        { 'text-[14px] font-extrabold': true },

        // Conditional Styling based on disabled state
        disabled
          ? 'transform cursor-not-allowed bg-primaryElevated text-secondary/70 transition-all' // Disabled styles
          : 'transform bg-highlight text-primaryDark transition-all active:bg-clickHighLight', // Normal/Active styles - always use highlight colors when enabled
        className
      )}>
      {/* Only show the icon if not loading */}
      {!!icon && !loading && icon}

      {/* Loading Spinner */}
      {loading && (
        <div className={'flex h-[24px] w-[24px] items-center justify-center'}>
          {/* Set spinner color for primaryDark text */}
          <ClipLoader color={'#1E2E3F'} size={18} />
        </div>
      )}

      {/* Button Text */}
      <span className={'truncate'}>{text}</span>
    </button>
  );
};
