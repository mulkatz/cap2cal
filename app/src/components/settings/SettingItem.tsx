import { ReactNode } from 'react';
import { cn } from '../../utils';

export const SettingSection = ({ title, children }: { title?: string; children: ReactNode }) => {
  return (
    <div className="flex w-full flex-col gap-3">
      {title && (
        <div className="flex items-center gap-3">
          <div className="h-[1px] flex-1 bg-accent/30" />
          <div className="text-[14px] font-semibold text-secondary/60">{title}</div>
          <div className="h-[1px] flex-1 bg-accent/30" />
        </div>
      )}
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
};

export const SettingItem = ({
  label,
  value,
  description,
  onClick,
  rightElement,
}: {
  label: string;
  value?: string;
  description?: string;
  onClick?: () => void;
  rightElement?: ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full flex-col items-start gap-1 rounded-lg border-[1px] border-accentElevated bg-primaryElevated px-4 py-3 text-left transition-all',
        onClick && 'active:bg-accent/20'
      )}>
      <div className="flex w-full items-center justify-between">
        <span className="text-[16px] font-medium text-secondary">{label}</span>
        {rightElement || (value && <span className="text-[14px] text-secondary/70">{value}</span>)}
      </div>
      {description && <p className="text-[13px] leading-relaxed text-secondary/60">{description}</p>}
    </button>
  );
};

export const SettingToggle = ({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'flex w-full flex-col items-start gap-1 rounded-lg border-[1px] border-accentElevated bg-primaryElevated px-4 py-3 text-left transition-all active:bg-accent/20'
      )}>
      <div className="flex w-full items-center justify-between">
        <span className="text-[16px] font-medium text-secondary">{label}</span>
        <div
          className={cn(
            'relative h-6 w-11 rounded-full transition-colors',
            checked ? 'bg-highlight' : 'bg-secondary/30'
          )}>
          <div
            className={cn(
              'absolute top-[2px] h-5 w-5 rounded-full bg-white transition-transform',
              checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
            )}
          />
        </div>
      </div>
      {description && <p className="text-[13px] leading-relaxed text-secondary/60">{description}</p>}
    </button>
  );
};

export const SettingDivider = () => {
  return <div className="h-[1px] w-full bg-accent/30" />;
};
