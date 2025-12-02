import React from 'react';
import { QuickActionTile } from './QuickActionTile';
import { Calendar, Image, Star, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QuickActionsGridProps {
  onHistory: () => void;
  onImport: () => void;
  onSettings: () => void;
  hasEvents: boolean;
  upcomingEventsCount?: number;
  favoritesCount?: number;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  onHistory,
  onImport,
  onSettings,
  hasEvents,
  upcomingEventsCount = 0,
  favoritesCount = 0,
}) => {
  const { t } = useTranslation();

  const handleFavorites = () => {
    // Navigate to history with favorites filter
    onHistory();
  };

  return (
    <div className="grid w-full grid-cols-2 gap-3 px-4">
      {/* Import from Gallery */}
      <QuickActionTile
        label={t('home.quickActions.import', 'Import')}
        icon={<Image size={28} strokeWidth={2} />}
        onClick={onImport}
      />

      {/* History / All Events */}
      <QuickActionTile
        label={t('home.quickActions.history', 'History')}
        icon={<Calendar size={28} strokeWidth={2} />}
        onClick={onHistory}
        badge={upcomingEventsCount}
        highlight={hasEvents}
      />

      {/* Favorites */}
      <QuickActionTile
        label={t('home.quickActions.favorites', 'Favorites')}
        icon={<Star size={28} strokeWidth={2} />}
        onClick={handleFavorites}
        badge={favoritesCount}
      />

      {/* Settings */}
      <QuickActionTile
        label={t('home.quickActions.settings', 'Settings')}
        icon={<Settings size={28} strokeWidth={2} />}
        onClick={onSettings}
      />
    </div>
  );
};
