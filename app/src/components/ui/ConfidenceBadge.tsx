import React from 'react';

interface ConfidenceBadgeProps {
  score: number;
  issues?: string[];
  size?: 'small' | 'medium';
}

type ConfidenceLevel = 'green' | 'yellow' | 'orange' | 'red';

/**
 * Displays a confidence score badge for scanned events
 * Shows color-coded indicator based on confidence level
 */
export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ score, issues = [], size = 'medium' }) => {
  // Determine color and icon based on confidence score
  const getConfidenceLevel = (): { color: ConfidenceLevel; label: string; emoji: string } => {
    if (score >= 0.9) return { color: 'green' as const, label: 'High', emoji: '✓' };
    if (score >= 0.7) return { color: 'yellow' as const, label: 'Good', emoji: '⚠' };
    if (score >= 0.5) return { color: 'orange' as const, label: 'Medium', emoji: '⚠' };
    return { color: 'red' as const, label: 'Low', emoji: '!' };
  };

  const level = getConfidenceLevel();

  const sizeClasses: Record<'small' | 'medium', string> = {
    small: 'text-xs px-2 py-0.5',
    medium: 'text-sm px-3 py-1',
  };

  const colorClasses: Record<ConfidenceLevel, string> = {
    green: 'bg-green-100 text-green-800 border-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    orange: 'bg-orange-100 text-orange-800 border-orange-300',
    red: 'bg-red-100 text-red-800 border-red-300',
  };

  // Format issues for display
  const issueLabels: Record<string, string> = {
    ambiguous_date: 'Unclear date',
    handwriting_unclear: 'Hard to read',
    inferred_year: 'Year estimated',
    low_contrast: 'Poor image quality',
  };

  const formattedIssues = issues.map((issue) => issueLabels[issue] || issue).join(', ');

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border ${colorClasses[level.color]} ${sizeClasses[size]} font-medium`}
      title={
        issues.length > 0
          ? `Confidence: ${(score * 100).toFixed(0)}% - Issues: ${formattedIssues}`
          : `Confidence: ${(score * 100).toFixed(0)}%`
      }
    >
      <span className="leading-none">{level.emoji}</span>
      <span className="leading-none">{(score * 100).toFixed(0)}%</span>
    </div>
  );
};
