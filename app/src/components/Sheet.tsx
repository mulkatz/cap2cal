import { Sheet, SheetRef } from 'react-modal-sheet';
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../utils.ts';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../models/db.ts';
import { CardController } from './Card.controller.tsx';
import { Card } from './Card.group.tsx';
import { useTranslation } from 'react-i18next';
import { IconClose } from '../assets/icons';

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
    [favouritesFilter, sortByFilter, db.eventItems]
  );

  useEffect(() => {
    // console.log(filteredAndSortedItems);
  }, [filteredAndSortedItems]);
  ``;
  return (
    <Sheet isOpen={isOpen} detent="content-height" onClose={onClose} className={'!z-20'}>
      <Sheet.Container className={'!bg-primaryDark'}>
        <Sheet.Header>
          <div className={'relative'}>
            <p className={'mb-3 mt-7 text-center text-[22px] font-bold text-secondary'}>{t('sheet.header')}</p>
            <span className={'absolute bottom-7 right-2'}>
              <button
                onClick={onClose}
                className={cn(
                  'group mr-2 box-border flex h-[48px] w-[48px] items-center justify-center text-secondary'
                )}>
                <span
                  className={cn(
                    'flex h-[38px] w-[38px] items-center justify-center rounded-full border-[1px] border-accentElevated bg-primaryElevated',
                    'border-[1px] border-secondary',
                    'transform transition-all duration-[800ms] group-active:bg-clickHighLight'
                  )}>
                  <IconClose width={18} height={18} />
                </span>
              </button>
            </span>
          </div>
        </Sheet.Header>
        <Sheet.Content className={'relative'} style={{ paddingBottom: ref.current?.y }}>
          <Sheet.Scroller>
            <span className="absolute left-0 top-[-1px] z-10 h-[12px] w-full bg-gradient-to-b from-primaryDark from-10% via-primaryDark/90 to-transparent"></span>
            <div className={'mt-3 flex grow'}>
              <div className={'w-full px-3'}>
                <FilterOption
                  className="mb-1"
                  label={t('general.sortBy')}
                  options={['relevance', 'time']}
                  value={t(`general.${sortByFilter}`)}
                  onChange={() =>
                    changeFilter(
                      sortByFilter,
                      setSortByFilter as any,
                      Object.keys(sortByOptions) as Array<keyof typeof sortByOptions>
                    )
                  }
                />

                <FilterOption
                  className="mt-2.5"
                  label={t('general.onlyFavourites')}
                  options={['yes', 'no']}
                  value={t(`general.${favouritesFilter}`)}
                  onChange={() => {
                    changeFilter(
                      favouritesFilter,
                      setFavouritesFilter as any,
                      Object.keys(favouriteOptions) as Array<keyof typeof favouriteOptions>
                    );
                  }}
                />

                <div className={'mx-auto my-2.5 h-[1.5px] w-[40%] self-center rounded-full bg-accentElevated'}></div>

                {filteredAndSortedItems && filteredAndSortedItems?.length > 0 ? (
                  <>
                    {filteredAndSortedItems?.map((value, index) => (
                      <div className={'mb-3'} key={index}>
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

const FilterOption = <T extends Record<string, string>>({
  label,
  options,
  value,
  onChange,
  className,
}: FilterOptionProps<T>) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border-[1px] border-accentElevated bg-primary px-2.5 py-2.5 pl-3 text-secondary',
        className
      )}>
      <div className="text-[16px] font-semibold">{label}</div>
      <button
        className="flex w-[105px] justify-center rounded-[4px] border-[1px] border-accentElevated bg-primaryElevated p-2 text-[16px]"
        onClick={() => onChange(value)}>
        <div className="cursor-pointer appearance-none bg-primaryElevated text-[16px] font-semibold outline-none">
          {value as string}
        </div>
      </button>
    </div>
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

const CameraIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
    <circle cx="12" cy="13" r="3"></circle>
  </svg>
);

const CalendarPlusIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>
    <path d="M8 2v4"></path>
    <path d="M16 2v4"></path>
    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
    <path d="M3 10h18"></path>
    <path d="M12 16h-4"></path>
    <path d="M16 16h-4"></path>
    <path d="M12 14v4"></path>
  </svg>
);

const HeartIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const StarIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const TestCard = () => {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-800/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
      {/* Header Section */}
      <div className="border-b border-slate-700/60 pb-5">
        <p className="text-sm font-medium text-indigo-400">Konzert</p>
        <h1 className="mt-1 text-3xl font-bold text-white">Tom Hengst - High Stakes Tour 2025</h1>

        <div className="mt-4 flex items-end justify-between">
          <p className="text-2xl font-semibold text-white">17. Oktober</p>
          <p className="text-xl font-medium text-slate-300">20 Uhr</p>
        </div>
      </div>

      {/* Location & Details Section */}
      <div className="py-5">
        <h2 className="text-lg font-bold tracking-widest text-white">BERLIN</h2>
        <p className="text-sm text-slate-400">HUXLEY'S NEUE WELT</p>

        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          Erleben Sie Tom Hengst live auf seiner High Stakes Tour 2025! Freuen Sie sich auf einen unvergesslichen Abend
          voller Musik und Unterhaltung.
        </p>
      </div>

      {/* Action Icons Section */}
      <div className="mb-5 flex items-center justify-between space-x-3">
        {['camera', 'calendar', 'star'].map((icon) => (
          <button
            key={icon}
            className="group flex-1 rounded-xl bg-slate-700/50 p-3 text-slate-400 transition-all duration-200 ease-in-out hover:bg-slate-700/80 hover:text-white active:bg-slate-700">
            {icon === 'camera' && (
              <CameraIcon className="mx-auto h-6 w-6 transition-transform group-hover:scale-110 group-active:scale-95" />
            )}
            {icon === 'calendar' && (
              <CalendarPlusIcon className="mx-auto h-6 w-6 transition-transform group-hover:scale-110 group-active:scale-95" />
            )}
            {icon === 'star' && (
              <StarIcon className="mx-auto h-6 w-6 transition-transform group-hover:scale-110 group-active:scale-95" />
            )}
          </button>
        ))}
      </div>

      {/* Purchase Button - Primary Call to Action */}
      <button className="w-full transform rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3.5 text-center font-bold text-white shadow-lg shadow-indigo-500/30 transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-indigo-500/50 active:scale-95">
        Tickets kaufen
      </button>
    </div>
  );
};
