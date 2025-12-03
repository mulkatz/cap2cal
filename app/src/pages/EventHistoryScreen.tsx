import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db.ts';
import { CardController } from '../components/features/cards/CardController.tsx';
import { Card } from '../components/features/cards/CardGroup.tsx';
import { IconChevronLeft, IconStar, IconTriangleRight, ArrowUpDown, ChevronDown } from '../assets/icons';
import { cn } from '../utils';
import type { CaptureEvent } from '../models/CaptureEvent';

export const EventHistoryScreen = React.memo(
  ({
    onClose,
    isVisible,
    initialSortBy = 'upcoming',
  }: {
    onClose: () => void;
    isVisible: boolean;
    initialSortBy?: 'upcoming' | 'recent';
  }) => {
    const { t } = useTranslation();
    const [favouritesFilter, setFavouritesFilter] = useState<keyof typeof favouriteOptions>('no');
    const [sortByFilter, setSortByFilter] = useState<keyof typeof sortByOptions>(initialSortBy);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showPastEvents, setShowPastEvents] = useState(false);

    // Update sort filter when screen becomes visible with new initialSortBy
    useEffect(() => {
      if (isVisible && initialSortBy) {
        setSortByFilter(initialSortBy);
      }
    }, [isVisible, initialSortBy]);

    // Always keep query running to maintain cached results for instant display
    const filteredItems = useLiveQuery(
      () => db.eventItems.filter((obj) => (favouritesFilter === 'yes' ? !!obj.isFavorite : true)).toArray(),
      [favouritesFilter]
    );

    // Separate upcoming and past events
    const { upcomingEvents, pastEvents } = useMemo(() => {
      if (!filteredItems) {
        return { upcomingEvents: [], pastEvents: [] };
      }

      const now = new Date();
      now.setHours(0, 0, 0, 0); // Start of today
      const todayMillis = now.getTime();

      const upcoming: CaptureEvent[] = [];
      const past: CaptureEvent[] = [];

      filteredItems.forEach((item) => {
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

      // Sort based on user selection
      if (sortByFilter === 'recent') {
        // Sort by timestamp (most recently added first)
        upcoming.sort((a, b) => b.timestamp - a.timestamp);
        past.sort((a, b) => b.timestamp - a.timestamp);
      } else {
        // Sort by event date (upcoming: nearest first, past: most recent first)
        upcoming.sort((a, b) => {
          const startA = getEventSortTimestamp(a);
          const startB = getEventSortTimestamp(b);
          return startA - startB; // ASC - nearest dates first
        });
        past.sort((a, b) => {
          const startA = getEventSortTimestamp(a);
          const startB = getEventSortTimestamp(b);
          return startB - startA; // DESC - most recent dates first
        });
      }

      return { upcomingEvents: upcoming, pastEvents: past };
    }, [filteredItems, sortByFilter]);

    const handleSortByChange = useCallback(() => {
      changeFilter(
        sortByFilter,
        setSortByFilter as any,
        Object.keys(sortByOptions) as Array<keyof typeof sortByOptions>
      );
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
            <div className="scrollbar-hide flex gap-3 overflow-x-auto">
              <FilterChip
                label={t('general.onlyFavourites').replace('Nur ', '')}
                active={favouritesFilter === 'yes'}
                onClick={handleFavouritesChange}
                icon={
                  <IconStar
                    size={16}
                    className={cn(
                      favouritesFilter === 'yes' ? 'fill-highlight text-highlight' : 'fill-transparent text-gray-300'
                    )}
                  />
                }
              />
              <FilterChip
                label={`Sort: ${t(`general.${sortByFilter}`)}`}
                active={false}
                onClick={handleSortByChange}
                icon={<ArrowUpDown size={16} className="text-gray-300" />}
                chevron={<ChevronDown size={14} className="text-gray-500" />}
              />
            </div>

            {/* Event Cards */}
            {filteredItems && filteredItems?.length > 0 ? (
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
                      <div className="flex flex-col gap-5">
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
  }
);

// Filter Chip Component - Ghost Pill Style
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
    chevron?: React.ReactNode;
  }) => {
    return (
      <button
        onClick={onClick}
        className={cn(
          'flex flex-shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-medium transition-all',
          active ? 'border-highlight bg-highlight/10 text-highlight' : 'border-white/20 bg-white/5 text-gray-300'
        )}>
        {icon && <span className="flex items-center">{icon}</span>}
        <span>{label}</span>
        {chevron && <span className="flex items-center">{chevron}</span>}
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
  upcoming: 'upcoming',
  recent: 'recent',
};

// Helper functions
const toDateTimeMillis = (params?: { date?: string; timezone?: string; time?: string }) => {
  if (!params) return null;
  if (!params.date || !params.time) return null;
  return new Date(`${params.date}T${params.time}`).getTime();
};

// Get sortable timestamp for an event (handles events with date but no time)
const getEventSortTimestamp = (event: CaptureEvent): number => {
  const dateTimeMillis = toDateTimeMillis(event.dateTimeFrom);
  if (dateTimeMillis !== null) {
    return dateTimeMillis;
  }

  // If no time, but has a date, use date at midnight
  if (event.dateTimeFrom?.date) {
    const date = new Date(event.dateTimeFrom.date);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }

  // If no date at all, sort to the end
  return Number.MAX_SAFE_INTEGER;
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
