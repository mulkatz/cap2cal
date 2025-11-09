import React from 'react';
import { useTranslation } from 'react-i18next';

interface CaptureCounterProps {
  capturesRemaining: number;
  limit: number;
}

export const CaptureCounter: React.FC<CaptureCounterProps> = ({ capturesRemaining, limit }) => {
  const { t } = useTranslation();

  // Calculate progress percentage for visual indicator
  const progressPercentage = (capturesRemaining / limit) * 100;

  // Determine color based on remaining captures
  const getColorClass = () => {
    if (capturesRemaining === 0) return 'text-warn border-warn';
    if (capturesRemaining <= 1) return 'text-highlight border-highlight';
    return 'text-secondary border-accentElevated';
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${getColorClass()} transition-all duration-300`}>
      {/* Progress circle */}
      <div className="relative h-5 w-5">
        <svg className="h-5 w-5 -rotate-90 transform" viewBox="0 0 20 20">
          {/* Background circle */}
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.2"
          />
          {/* Progress circle */}
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${(progressPercentage / 100) * 50.27} 50.27`}
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Counter text */}
      <span className="text-sm font-semibold">
        {t('dialogs.upgrade.capturesRemaining', { count: capturesRemaining })}
      </span>
    </div>
  );
};
