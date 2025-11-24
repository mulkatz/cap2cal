import React from 'react';

export interface BenefitItem {
  text: string;
  variant?: 'default' | 'success' | 'highlight';
}

interface BenefitsListProps {
  items: BenefitItem[];
  className?: string;
}

export const BenefitsList: React.FC<BenefitsListProps> = ({ items, className = '' }) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {items.map((item, index) => (
        <BenefitItem key={index} text={item.text} variant={item.variant || 'highlight'} />
      ))}
    </div>
  );
};

interface BenefitItemProps {
  text: string;
  variant: 'default' | 'success' | 'highlight';
}

const BenefitItem: React.FC<BenefitItemProps> = ({ text, variant }) => {
  const getBgColor = () => {
    switch (variant) {
      case 'success':
        return 'bg-gradient-to-br from-green-500 to-green-600 shadow-md';
      case 'highlight':
        return 'bg-highlight';
      default:
        return 'bg-gray-500';
    }
  };

  const getIconColor = () => {
    return variant === 'highlight' ? 'text-primaryDark' : 'text-white';
  };

  return (
    <div className="flex items-start gap-3">
      <div
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${getBgColor()}`}>
        <svg className={`h-3 w-3 ${getIconColor()}`} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <p className="text-sm text-gray-300">{text}</p>
    </div>
  );
};
