import { IconCalendarPlus, IconCamera, IconExport, IconStar } from '../assets/icons';
// Import all utilities from a single source
import { cn } from '../utils.ts';
import { IconButton } from './buttons/IconButton.tsx';
import { CaptureEvent } from '../models/CaptureEvent.ts';
import React, { useState } from 'react';
import { TicketButton } from './TicketButton.tsx';
import { Card } from './Card.group.tsx';
import { useTranslation } from 'react-i18next';

type Props = {
  data: CaptureEvent;
  isFavourite: boolean;
  onFavourite: () => void;
  onImage: () => void;
  onExport: () => void;
  onAddress?: () => void;
};

// ## Sub-component: DateBadge
// Compact calendar-leaf style badge for inline display
const DateBadge = ({ dateTime }: { dateTime?: { date?: string; time?: string } }) => {
  if (!dateTime?.date) return null;

  // Parse the date to extract day and month
  const date = new Date(dateTime.date);
  const day = date.getDate().toString();
  // Use device's current locale automatically by passing undefined
  const month = new Intl.DateTimeFormat(undefined, { month: 'short' }).format(date).toUpperCase();

  return (
    <div className="flex w-14 flex-none flex-col overflow-hidden rounded-lg shadow-sm">
      {/* Top Bar - Month */}
      <div className="bg-highlight px-2 py-1 text-center">
        <div className="text-[10px] font-bold tracking-wide text-primaryDark">{month}</div>
      </div>
      {/* Bottom Body - Day */}
      <div className="bg-primaryDark px-2 py-2 text-center">
        <div className="text-xl font-bold leading-none text-white">{day}</div>
      </div>
    </div>
  );
};

// ## Main Component: EventCardAtom
const EventCardAtom = React.memo(({ data, onFavourite, isFavourite, onImage, onExport, onAddress }: Props) => {
  const { t } = useTranslation();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const {
    title,
    kind,
    location,
    dateTimeFrom,
    description,
    ticketDirectLink,
    id,
    ticketAvailableProbability,
    alreadyFetchedTicketLink,
  } = data;

  // Character limit for description truncation
  const TRUNCATE_LENGTH = 120;
  const shouldTruncate = description?.short && description.short.length > TRUNCATE_LENGTH;

  // Extracted complex boolean logic into a readable variable
  const showTicketButton =
    !!ticketDirectLink ||
    !!alreadyFetchedTicketLink ||
    (!!ticketAvailableProbability && ticketAvailableProbability > 0.7);

  // --- Render ---
  return (
    <Card
      highlight={isFavourite}
      inline
      usePattern
      className={
        'max-h-[60vh] overflow-hidden border border-white/5 bg-primaryElevated bg-gradient-to-br from-primaryElevated to-primaryElevated/80 shadow-lg'
      }>
      <div className="flex flex-col p-5">
        {/* Header Row: Date Badge + Title + Star */}
        <div className="mb-3 flex items-start gap-3">
          {/* Date Badge */}
          <DateBadge dateTime={dateTimeFrom} />

          {/* Title and Subtitle Stack */}
          <div className="flex-1 self-start">
            <h3 className="line-clamp-2 text-lg font-bold leading-tight text-white">{title}</h3>
            {kind && (
              <span className="mt-1.5 inline-block rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-highlight">
                {kind}
              </span>
            )}
          </div>

          {/* Favorite Star */}
          <button onClick={onFavourite} className="flex-shrink-0 transition-transform active:scale-90">
            <IconStar
              width={24}
              height={24}
              className={cn('transition-colors', isFavourite ? 'fill-highlight text-highlight' : 'text-white/60')}
            />
          </button>
        </div>

        {/* Location */}
        {location && (
          <div className="mb-2 flex cursor-pointer items-center gap-2" onClick={onAddress}>
            <svg
              className="flex-shrink-0 text-secondary/40"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="text-sm capitalize text-secondary/70">
              {[location?.city, location?.address].filter(Boolean).join(', ')}
            </span>
          </div>
        )}

        {/* Description */}
        {description?.short && (
          <div className="mb-4">
            <p className={cn('text-sm text-secondary/60', shouldTruncate && !isDescriptionExpanded && 'line-clamp-3')}>
              {description.short}
              {shouldTruncate && !isDescriptionExpanded && (
                <button onClick={() => setIsDescriptionExpanded(true)} className="ml-1 font-bold text-highlight">
                  ...{t('general.more', 'mehr')}
                </button>
              )}
            </p>
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center gap-2 pt-2">
          <IconButton onClick={onImage} icon={<IconCamera />} className="h-10 w-10" />
          <IconButton onClick={onExport} icon={<IconCalendarPlus />} className="h-10 w-10" />

          {/* Ticket Button - Fills remaining width */}
          {showTicketButton && (
            <div className="flex-1">
              <TicketButton isFavourite={isFavourite} id={id} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
});

export default EventCardAtom;
