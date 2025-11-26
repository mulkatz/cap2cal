import React, { useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../models/db';
import { CardController } from '../Card.controller';
import { Card } from '../Card.group';
import { IconChevronLeft, IconTriangleRight, IconStar } from '../../assets/icons';
import { cn } from '../../utils';
import type { CaptureEvent } from '../../models/CaptureEvent';

export const EventHistoryScreen = React.memo(({ onClose, isVisible }: { onClose: () => void; isVisible: boolean }) => {
  const { t } = useTranslation();
  const [favouritesFilter, setFavouritesFilter] = useState<keyof typeof favouriteOptions>('no');
  const [sortByFilter, setSortByFilter] = useState<keyof typeof sortByOptions>('time');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(false);

  // Always keep query running to maintain cached results for instant display
  const filteredAndSortedItems = useLiveQuery(
    () =>
      db.eventItems
        .filter((obj) => (favouritesFilter === 'yes' ? !!obj.isFavorite : true))
        .toArray()
        .then((items) => {
          return sortByFilter === 'time'
            ? items.sort((a, b) => b.timestamp - a.timestamp)
            : items.sort((a, b) => {
                const startA = toDateTimeMillis(a.dateTimeFrom) ?? 0;
                const startB = toDateTimeMillis(b.dateTimeFrom) ?? 0;
                return startB - startA;
              });
        }),
    [favouritesFilter, sortByFilter]
  );

  // Separate upcoming and past events
  const { upcomingEvents, pastEvents } = useMemo(() => {
    if (!filteredAndSortedItems) {
      return { upcomingEvents: [], pastEvents: [] };
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today
    const todayMillis = now.getTime();

    const upcoming: CaptureEvent[] = [];
    const past: CaptureEvent[] = [];

    filteredAndSortedItems.forEach((item) => {
      // Extract just the date (ignore time) for comparison
      const eventDateStr = item.dateTimeFrom?.date;
      if (!eventDateStr) {
        // If no date, put in upcoming by default
        upcoming.push(item);
        return;
      }

      const eventDate = new Date(eventDateStr);
      eventDate.setHours(0, 0, 0, 0);
      const eventDateMillis = eventDate.getTime();

      if (eventDateMillis < todayMillis) {
        past.push(item);
      } else {
        upcoming.push(item);
      }
    });

    // Sort upcoming events: nearest date first
    upcoming.sort((a, b) => {
      const startA = toDateTimeMillis(a.dateTimeFrom) ?? 0;
      const startB = toDateTimeMillis(b.dateTimeFrom) ?? 0;
      return startA - startB;
    });

    // Sort past events: most recent first
    past.sort((a, b) => {
      const startA = toDateTimeMillis(a.dateTimeFrom) ?? 0;
      const startB = toDateTimeMillis(b.dateTimeFrom) ?? 0;
      return startB - startA;
    });

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [filteredAndSortedItems]);

  const handleSortByChange = useCallback(() => {
    changeFilter(sortByFilter, setSortByFilter as any, Object.keys(sortByOptions) as Array<keyof typeof sortByOptions>);
  }, [sortByFilter]);

  const handleFavouritesChange = useCallback(() => {
    changeFilter(
      favouritesFilter,
      setFavouritesFilter as any,
      Object.keys(favouriteOptions) as Array<keyof typeof favouriteOptions>
    );
  }, [favouritesFilter]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 0);
  };

  return (
    <div
      className={cn(
        'absolute inset-0 z-50 flex flex-col bg-primary transition-transform duration-300 ease-out',
        isVisible ? 'pointer-events-auto translate-x-0' : 'pointer-events-none translate-x-full'
      )}>
      {/* Header */}
      <div
        className={`sticky top-0 z-10 flex h-16 items-center justify-between border-b border-accent/30 bg-primary px-4 pb-8 transition-shadow duration-200 pt-safe-offset-6 ${isScrolled ? 'shadow-[0_4px_12px_rgba(0,0,0,0.15)]' : ''}`}>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-secondary transition-colors active:text-highlight">
          <IconChevronLeft size={24} />
        </button>
        <h1 className="text-[20px] font-semibold text-secondary">{t('sheet.header')}</h1>
        <div className="w-8" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-safe-offset-0" onScroll={handleScroll}>
        <div className="mx-auto flex max-w-2xl flex-col gap-4 pb-4">
          {/* Horizontal Chip Filter Row */}
          <div className="flex gap-3 overflow-x-auto">
            <FilterChip
              label={t('general.onlyFavourites').replace('Nur ', '')}
              active={favouritesFilter === 'yes'}
              onClick={handleFavouritesChange}
              icon={
                <IconStar
                  width={14}
                  height={14}
                  className={cn(
                    favouritesFilter === 'yes' ? 'fill-highlight text-highlight' : 'fill-gray-400 text-gray-400'
                  )}
                />
              }
            />
            <FilterChip
              label={`${t('general.sortBy').replace('Sortieren nach', 'Sortieren')}: ${t(`general.${sortByFilter}`)}`}
              active={false}
              onClick={handleSortByChange}
              chevron={true}
            />
          </div>

          {/* Event Cards */}
          {filteredAndSortedItems && filteredAndSortedItems?.length > 0 ? (
            <>
              {/* Upcoming Events */}
              {upcomingEvents.map((value) => (
                <div key={value.id}>
                  <CardController data={value} />
                </div>
              ))}

              {/* Past Events Accordion */}
              {pastEvents.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowPastEvents(!showPastEvents)}
                    className="flex w-full items-center justify-center gap-2 py-4 text-[14px] text-gray-500 transition-colors active:text-gray-400">
                    <span>{t('sheet.showPastEvents')}</span>
                    <IconTriangleRight
                      width={12}
                      height={12}
                      className={cn('transition-transform duration-200', showPastEvents ? 'rotate-90' : 'rotate-0')}
                    />
                  </button>

                  {/* Past Events List */}
                  {showPastEvents && (
                    <div className="flex flex-col gap-4">
                      {pastEvents.map((value) => (
                        <div key={value.id} className="opacity-60">
                          <CardController data={value} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <Card>
              <div className="flex min-h-[200px] w-full items-center justify-center text-center text-secondary">
                <p className="text-[16px]">{t('sheet.noFavouritesYet')}</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
});

// Filter Chip Component - Ghost Button Style
const FilterChip = React.memo(
  ({
    label,
    active,
    onClick,
    icon,
    chevron,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
    chevron?: boolean;
  }) => {
    return (
      <button
        onClick={onClick}
        className={cn(
          'flex flex-shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all',
          active
            ? 'border-highlight bg-highlight/5 text-highlight'
            : 'border-gray-600 bg-transparent text-gray-400 hover:border-gray-500'
        )}>
        {icon && <span className="flex items-center">{icon}</span>}
        {label}
        {chevron && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-0.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </button>
    );
  }
);

// Options
const favouriteOptions = {
  yes: 'yes',
  no: 'no',
};

const sortByOptions = {
  relevance: 'relevance',
  time: 'time',
};

// Helper functions
const toDateTimeMillis = (params?: { date?: string; timezone?: string; time?: string }) => {
  if (!params) return null;
  if (!params.date || !params.time) return null;
  return new Date(`${params.date}T${params.time}`).getTime();
};

const changeFilter = <T extends Record<string, string>>(
  currentFilter: keyof T,
  setFilter: React.Dispatch<React.SetStateAction<keyof T>>,
  options: Array<keyof T>
) => {
  const currentIndex = options.indexOf(currentFilter);
  const nextIndex = (currentIndex + 1) % options.length;
  const nextValue = options[nextIndex];
  setFilter(nextValue);
};
