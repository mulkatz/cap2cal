import React, { useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../models/db';
import { CardController } from '../Card.controller';
import { Card } from '../Card.group';
import { IconChevronLeft } from '../../assets/icons';
import { cn } from '../../utils';

export const EventHistoryScreen = React.memo(({ onClose, isVisible }: { onClose: () => void; isVisible: boolean }) => {
  const { t } = useTranslation();
  const [favouritesFilter, setFavouritesFilter] = useState<keyof typeof favouriteOptions>('no');
  const [sortByFilter, setSortByFilter] = useState<keyof typeof sortByOptions>('time');
  const [isScrolled, setIsScrolled] = useState(false);

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
    <div className={cn(
      "absolute inset-0 z-50 flex flex-col bg-primary transition-transform duration-300 ease-out",
      isVisible
        ? "translate-x-0 pointer-events-auto"
        : "translate-x-full pointer-events-none"
    )}>
      {/* Header */}
      <div className={`sticky top-0 z-10 flex h-16 items-center justify-between border-b border-accent/30 bg-primary px-4 pb-8 pt-safe-offset-6 transition-shadow duration-200 ${isScrolled ? 'shadow-[0_4px_12px_rgba(0,0,0,0.15)]' : ''}`}>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-secondary transition-colors active:text-highlight">
          <IconChevronLeft width={24} height={24} />
        </button>
        <h1 className="text-[20px] font-semibold text-secondary">{t('sheet.header')}</h1>
        <div className="w-8" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-safe-offset-0" onScroll={handleScroll}>
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {/* Horizontal Chip Filter Row */}
          <div className="flex gap-2 overflow-x-auto">
            <FilterChip
              label={t('general.onlyFavourites')}
              active={favouritesFilter === 'yes'}
              onClick={handleFavouritesChange}
            />
            <FilterChip
              label={`${t('general.sortBy')}: ${t(`general.${sortByFilter}`)}`}
              active={false}
              onClick={handleSortByChange}
            />
          </div>

          {/* Event Cards */}
          {filteredAndSortedItems && filteredAndSortedItems?.length > 0 ? (
            <>
              {filteredAndSortedItems?.map((value) => (
                <div key={value.id}>
                  <CardController data={value} />
                </div>
              ))}
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

// Filter Chip Component
const FilterChip = React.memo(({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-shrink-0 rounded-full px-4 py-2 text-[14px] font-semibold transition-all',
        active ? 'bg-clickHighLight text-primaryDark' : 'bg-primaryElevated text-secondary'
      )}>
      {label}
    </button>
  );
});

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
