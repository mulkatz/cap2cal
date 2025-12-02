import { IconCamera3, IconHeroText } from '../assets/icons';
import React, { useMemo } from 'react';
import { cn } from '../utils.ts';
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';
import { useRipple } from '../hooks/useRipple.tsx';
import { StatsDashboard, QuickActionsGrid, EventsPreview, EmptyState } from '../components/features/home';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db.ts';

export const HomeViewNew = ({
  isLoading,
  onImport,
  onHistory,
  hasSavedEvents,
  onFeedback,
  isFeedbackVisible,
  onShowPaywall,
  hasReachedCaptureLimit,
  onSettings,
  onCapture,
}: {
  isLoading: boolean;
  onImport: () => void;
  onHistory: () => void;
  hasSavedEvents: boolean;
  onFeedback: () => void;
  isFeedbackVisible: boolean;
  onShowPaywall?: (trigger: string) => void;
  hasReachedCaptureLimit?: boolean;
  onSettings: () => void;
  onCapture: () => void;
}) => {
  const { t } = useTranslation();
  const { ripples, addRipple } = useRipple();

  // Query events for stats
  const allEvents = useLiveQuery(() => db.eventItems.toArray());

  // Calculate stats
  const stats = useMemo(() => {
    if (!allEvents) return { upcomingCount: 0, favoritesCount: 0 };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let upcomingCount = 0;
    let favoritesCount = 0;

    allEvents.forEach((event) => {
      const eventDateStr = event.dateTimeFrom?.date;
      if (eventDateStr) {
        const eventDate = new Date(eventDateStr);
        const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        if (eventDateOnly >= today) {
          upcomingCount++;
        }
      }
      if (event.isFavorite) {
        favoritesCount++;
      }
    });

    return { upcomingCount, favoritesCount };
  }, [allEvents]);

  const handleUpgradeClick = () => {
    onShowPaywall?.('upgrade_button_click');
  };

  const handleCaptureClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    addRipple(event);
    onCapture();
  };

  const handleEventClick = (eventId: string) => {
    // Navigate to history and select the event
    onHistory();
  };

  return (
    <>
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-primary">
        <div className={'magicpattern absolute inset-0 flex'} />
        <div
          className={cn(
            'relative inset-0 h-full w-full bg-gradient-to-b from-transparent to-black/30'
          )}></div>
      </div>

      {/* Upgrade button - only show when user has reached their capture limit */}
      {hasReachedCaptureLimit && (
        <div className={'absolute left-1/2 top-safe-offset-2 z-50 flex h-[24px] items-center justify-center'}>
          <button
            onClick={handleUpgradeClick}
            className="pointer-events-auto flex -translate-x-1/2 items-center gap-2 rounded-full border border-highlight bg-primaryElevated px-4 py-2 shadow-lg transition-all hover:bg-primaryElevated/80 active:scale-95">
            <svg className="h-4 w-4 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-semibold text-highlight">{t('dialogs.upgrade.cta')}</span>
          </button>
        </div>
      )}

      {/* Scrollable Content Container */}
      <div className="pointer-events-auto absolute inset-0 flex flex-col overflow-y-auto pb-safe-offset-6">
        {/* Logo/Hero - Smaller and at top */}
        <div className="flex items-center justify-center py-8 pt-safe-offset-12">
          <IconHeroText className="w-48" />
        </div>

        {/* Stats Dashboard */}
        {hasSavedEvents && (
          <div className="mb-6">
            <StatsDashboard />
          </div>
        )}

        {/* Quick Actions Grid */}
        <div className="mb-6">
          <QuickActionsGrid
            onHistory={onHistory}
            onImport={onImport}
            onSettings={onSettings}
            hasEvents={hasSavedEvents}
            upcomingEventsCount={stats.upcomingCount}
            favoritesCount={stats.favoritesCount}
          />
        </div>

        {/* Events Preview or Empty State */}
        <div className="mb-6 flex-1">
          {hasSavedEvents ? (
            <EventsPreview onEventClick={handleEventClick} onSeeAll={onHistory} />
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Spacer for capture button */}
        <div className="h-32" />
      </div>

      {/* Capture Button - Fixed at bottom */}
      <div className={'pointer-events-none absolute bottom-0 left-0 right-0 z-50 flex justify-center pb-safe-offset-8'}>
        <button
          onClick={handleCaptureClick}
          className={
            'pointer-events-auto relative z-50 flex min-w-60 items-center justify-center gap-2 overflow-hidden rounded-full border-b-4 border-[#C4BD42] bg-highlight px-6 py-4 text-2xl font-bold text-primary shadow-2xl transition-all active:translate-y-1 active:border-b-2 active:shadow-[0_2px_8px_0_rgba(230,222,77,0.3)]'
          }
          data-testid="capture-button">
          {/* Ripple effects */}
          {ripples.map((ripple) => (
            <span
              key={ripple.key}
              className="absolute animate-ripple rounded-full bg-white/30"
              style={{
                left: ripple.x - ripple.size / 2,
                top: ripple.y - ripple.size / 2,
                width: ripple.size,
                height: ripple.size,
              }}
            />
          ))}

          {isLoading && (
            <ClipLoader
              className={'mb-0.5'}
              color={'#1E2E3F'}
              size={28}
              cssOverride={{
                borderWidth: 3,
              }}
            />
          )}
          {!isLoading && <IconCamera3 size={28} className={'mb-0.5'} />}
          <span>{t('general.capture')}</span>
        </button>
      </div>
    </>
  );
};
