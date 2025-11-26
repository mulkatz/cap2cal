import { Sheet, SheetRef } from 'react-modal-sheet';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../utils.ts';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../models/db.ts';
import { CardController } from './Card.controller.tsx';
import { Card } from './Card.group.tsx';
import { useTranslation } from 'react-i18next';
import { IconStar } from '../assets/icons';
import { CloseButton } from './buttons/CloseButton';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const toDateTimeMillis = (params?: { date?: string; timezone?: string; time?: string }) => {
  if (!params) return null;
  if (!params.date || !params.time) return null;
  return new Date(`${params.date}T${params.time}`).getTime();
};

export const CaptureSheet = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation();
  const [favouritesFilter, setFavouritesFilter] = useState<keyof typeof favouriteOptions>('no');
  const [sortByFilter, setSortByFilter] = useState<keyof typeof sortByOptions>('time');
  const ref = useRef<SheetRef>();

  const filteredAndSortedItems = useLiveQuery(
    () =>
      db.eventItems
        .filter((obj) => (favouritesFilter === 'yes' ? !!obj.isFavorite : true))
        .toArray()
        .then((items) => {
          return sortByFilter === 'time'
            ? items.sort((a, b) => b.timestamp - a.timestamp) // Sort by time
            : items.sort((a, b) => {
                const startA = toDateTimeMillis(a.dateTimeFrom) ?? 0;
                const startB = toDateTimeMillis(b.dateTimeFrom) ?? 0;
                return startB - startA;
              });
        }),
    [favouritesFilter, sortByFilter] // Removed db.eventItems as it's stable
  );

  useEffect(() => {
    // console.log(filteredAndSortedItems);
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

  return (
    <Sheet isOpen={isOpen} detent="content-height" onClose={onClose} className={'!z-20'}>
      <Sheet.Container className={'!bg-primaryDark'}>
        <Sheet.Header>
          <div className={'relative'}>
            <div className="mx-auto mb-4 mt-2 h-1 w-12 rounded-full bg-accentElevated opacity-50" />

            <p className={'mb-3 mt-7 text-center text-[22px] font-bold text-secondary'}>{t('sheet.header')}</p>
            <span className={'absolute -top-6 right-2'}>
              <CloseButton onClick={onClose} className="mr-2" />
            </span>
          </div>
        </Sheet.Header>
        <Sheet.Content className={'relative'} style={{ paddingBottom: ref.current?.y }}>
          <Sheet.Scroller>
            <span className="absolute left-0 top-[-1px] z-10 h-[12px] w-full bg-gradient-to-b from-primaryDark from-10% via-primaryDark/90 to-transparent"></span>
            <div className={'mt-3 flex grow'}>
              <div className={'w-full px-3'}>
                {/* Horizontal Chip Filter Row */}
                <div className={'mb-4 flex gap-2 overflow-x-auto'}>
                  <FilterChip
                    label={t('general.onlyFavourites')}
                    active={favouritesFilter === 'yes'}
                    onClick={handleFavouritesChange}
                    icon={
                      <IconStar
                        size={16}
                        className={cn(favouritesFilter === 'yes' ? 'text-primaryDark' : 'text-secondary')}
                        fill="currentColor"
                      />
                    }
                  />
                  <FilterChip
                    label={`${t('general.sortBy')}: ${t(`general.${sortByFilter}`)}`}
                    active={false}
                    onClick={handleSortByChange}
                  />
                </div>

                {filteredAndSortedItems && filteredAndSortedItems?.length > 0 ? (
                  <>
                    {filteredAndSortedItems?.map((value) => (
                      <div className={'mb-3'} key={value.id}>
                        {/*<TestCard />*/}
                        <CardController data={value} />
                      </div>
                    ))}
                  </>
                ) : (
                  <Card>
                    <div className={'flex min-h-[200px] w-full items-center justify-center text-center text-secondary'}>
                      <p className={'text-[16px]'}>{t('sheet.noFavouritesYet')}</p>
                    </div>
                  </Card>
                )}
                <div className={'h-5 pb-safe'}></div>
              </div>
            </div>
          </Sheet.Scroller>
          {/*</div>*/}
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={onClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }} />
    </Sheet>
  );
};

// Define a generic type that will take the keys of an object
type FilterOptionProps<T extends Record<string, string>> = {
  label: string;
  options: Array<keyof T>;
  value: keyof T;
  onChange: (newValue: keyof T) => void;
  className?: string;
};

const FilterOption = React.memo(
  <T extends Record<string, string>>({ label, options, value, onChange, className }: FilterOptionProps<T>) => {
    return (
      <div
        className={cn(
          'flex items-center justify-between rounded-full bg-primaryElevated px-4 py-3 text-secondary',
          className
        )}>
        <div className="text-[16px] font-semibold">{label}</div>
        <button
          className="flex w-[105px] justify-center rounded-full bg-primaryDark p-2.5 text-[16px] shadow-sm"
          onClick={() => onChange(value)}>
          <div className="cursor-pointer appearance-none bg-primaryDark text-[16px] font-semibold outline-none">
            {value as string}
          </div>
        </button>
      </div>
    );
  }
) as <T extends Record<string, string>>(props: FilterOptionProps<T>) => JSX.Element;

// New Filter Chip Component for horizontal layout
const FilterChip = ({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-semibold transition-all',
        active ? 'bg-clickHighLight text-primaryDark' : 'bg-primaryElevated text-secondary'
      )}>
      {icon && <span className="flex items-center">{icon}</span>}
      {label}
    </button>
  );
};

// Example options object for 'only favourites'
const favouriteOptions = {
  yes: 'yes',
  no: 'no',
};

// Example options object for 'sort by'
const sortByOptions = {
  relevance: 'relevance',
  time: 'time',
};

// Generalized function to change the current filter
const changeFilter = <T extends Record<string, string>>(
  currentFilter: keyof T,
  setFilter: React.Dispatch<React.SetStateAction<keyof T>>,
  options: Array<keyof T>
) => {
  const currentIndex = options.indexOf(currentFilter);
  const nextIndex = (currentIndex + 1) % options.length;
  const nextValue = options[nextIndex];

  // console.log(`Filter changed to: ${nextValue}`);
  setFilter(nextValue);
};

// TestCard component removed - was unused and only referenced in commented-out code
