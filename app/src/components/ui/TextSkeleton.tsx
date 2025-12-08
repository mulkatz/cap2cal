import React from 'react';

interface TextSkeletonProps {
  lines?: number;
  className?: string;
}

/**
 * Loading skeleton for text content
 * Shows animated placeholders while content is loading
 */
export const TextSkeleton: React.FC<TextSkeletonProps> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 rounded animate-pulse ${
            index === lines - 1 ? 'w-2/3' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

interface DescriptionSkeletonProps {
  className?: string;
}

/**
 * Specific skeleton for event descriptions
 * Includes icon and styled loading state
 */
export const DescriptionSkeleton: React.FC<DescriptionSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {/* Icon placeholder */}
      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse flex-shrink-0 mt-0.5" />

      {/* Text placeholder */}
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      </div>
    </div>
  );
};
