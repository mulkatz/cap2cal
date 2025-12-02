import React from 'react';
import { Sparkles, Zap, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../../utils';

interface FeatureHighlightProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureHighlight: React.FC<FeatureHighlightProps> = ({ icon, title, description, delay }) => {
  return (
    <div
      className={cn(
        'group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-primaryElevated/40 p-5 backdrop-blur-sm transition-all duration-300',
        'hover:border-highlight/30 hover:bg-primaryElevated/60'
      )}
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay}ms both`,
      }}>
      {/* Icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-highlight/15 text-highlight transition-all duration-300 group-hover:scale-110 group-hover:bg-highlight/25">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-center text-sm font-bold text-white">{title}</h3>

      {/* Description */}
      <p className="text-center text-xs leading-relaxed text-gray-400">{description}</p>
    </div>
  );
};

export const EmptyState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col gap-6 px-4">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-highlight/20">
          <Sparkles size={32} className="text-highlight" strokeWidth={2} />
        </div>
        <h2 className="text-xl font-bold text-white">{t('home.emptyState.title', 'Ready to Capture?')}</h2>
        <p className="max-w-xs text-sm text-gray-400">
          {t(
            'home.emptyState.description',
            "Snap a photo of any event poster, flyer, or ticket. We'll extract all the details instantly."
          )}
        </p>
      </div>

      {/* Feature highlights grid */}
      <div className="grid grid-cols-1 gap-3">
        <FeatureHighlight
          icon={<Sparkles size={24} strokeWidth={2} />}
          title={t('home.emptyState.feature1.title', 'AI-Powered Extraction')}
          description={t(
            'home.emptyState.feature1.description',
            'Automatically extract titles, dates, times, and locations'
          )}
          delay={100}
        />
        <FeatureHighlight
          icon={<Zap size={24} strokeWidth={2} />}
          title={t('home.emptyState.feature2.title', '3-Second Save')}
          description={t('home.emptyState.feature2.description', 'From photo to calendar in just 3 seconds')}
          delay={200}
        />
        <FeatureHighlight
          icon={<Calendar size={24} strokeWidth={2} />}
          title={t('home.emptyState.feature3.title', 'Export Anywhere')}
          description={t(
            'home.emptyState.feature3.description',
            'Export to Google, Apple, Outlook, or any calendar app'
          )}
          delay={300}
        />
      </div>

      {/* Call to action hint */}
      <div className="flex flex-col items-center gap-2 pt-4">
        <div className="animate-bounce">
          <svg
            className="h-6 w-6 text-highlight"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-highlight">
          {t('home.emptyState.cta', 'Tap the Capture button to get started')}
        </p>
      </div>
    </div>
  );
};

// Add fadeInUp animation to global styles
// This could be added to index.css or Tailwind config
