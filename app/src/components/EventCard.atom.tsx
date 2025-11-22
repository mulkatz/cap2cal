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
  locale?: string; // Dynamic locale prop (e.g., 'en-US', 'de-DE')
};

// Helper: Convert ALL CAPS text to Title Case
const toTitleCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// ## Sub-component: DateBadge
// Compact calendar-leaf style badge for inline display with dynamic locale support
const DateBadge = ({ dateTime, locale }: { dateTime?: { date?: string; time?: string }; locale?: string }) => {
  if (!dateTime?.date) return null;

  // Parse the date to extract day and month
  const date = new Date(dateTime.date);
  const day = date.getDate().toString();
  // Use the provided locale or device's current locale
  const month = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date).toUpperCase();

  return (
    <div className="flex w-14 flex-none flex-col overflow-hidden rounded-lg shadow-sm">
      {/* Top Bar - Month (Electric Yellow) - Increased vertical padding for better spacing */}
      <div className="bg-highlight px-2 py-1.5 pt-2 text-center">
        <div className="text-[10px] font-bold tracking-wide text-primaryDark">{month}</div>
      </div>
      {/* Bottom Body - Day (Dark Navy) */}
      <div className="bg-primaryDark px-2 py-2 text-center">
        <div className="text-xl font-bold leading-none text-white">{day}</div>
      </div>
    </div>
  );
};

// ## Main Component: EventCardAtom
const EventCardAtom = React.memo(({ data, onFavourite, isFavourite, onImage, onExport, onAddress, locale }: Props) => {
  const { t, i18n } = useTranslation();
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

  // Use provided locale or fall back to i18n language
  const effectiveLocale = locale || i18n.language;

  // Character limit for description truncation
  const TRUNCATE_LENGTH = 120;
  const shouldTruncate = description?.short && description.short.length > TRUNCATE_LENGTH;

  // Extracted complex boolean logic into a readable variable
  const showTicketButton =
    !!ticketDirectLink ||
    !!alreadyFetchedTicketLink ||
    (!!ticketAvailableProbability && ticketAvailableProbability > 0.7);

  // Format location with Title Case (fix ALL CAPS issue)
  const formatLocation = (city?: string, address?: string): string => {
    const parts = [city, address].filter(Boolean).map((part) => toTitleCase(part as string));
    return parts.join(', ');
  };

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
        {/* Header Row: Date Badge + Title + Category Chip + Star */}
        <div className="mb-3 flex items-start gap-3">
          {/* Date Badge */}
          <DateBadge dateTime={dateTimeFrom} locale={effectiveLocale} />

          {/* Title and Category Chip Stack */}
          <div className="flex-1 self-start">
            <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-white">{title}</h3>
            {kind && (
              <span className="mt-2 inline-block rounded-full bg-yellow-400/10 px-2.5 py-1 text-xs font-medium text-highlight">
                {kind}
              </span>
            )}
          </div>

          {/* Favorite Star - Yellow Circle when Active */}
          <button
            onClick={onFavourite}
            className={cn(
              'flex-shrink-0 transition-all active:scale-90',
              isFavourite ? 'rounded-full bg-highlight p-1.5' : ''
            )}>
            <IconStar
              width={24}
              height={24}
              className={cn('transition-colors', isFavourite ? 'fill-primaryDark text-primaryDark' : 'text-white/30')}
            />
          </button>
        </div>

        {/* Location (Title Case) - Interactive Link Styling */}
        {location && (
          <div className="mb-2 flex cursor-pointer items-center gap-2" onClick={onAddress}>
            <svg
              className="flex-shrink-0 text-highlight"
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
            <span className="text-sm font-normal text-gray-100 underline decoration-1 underline-offset-4 decoration-gray-500/30">
              {formatLocation(location?.city, location?.address)}
            </span>
          </div>
        )}

        {/* Description with Smart Read More */}
        {description?.short && (
          <div className="mb-4">
            <p
              className={cn(
                'text-[13px] font-light tracking-[0.5px] text-gray-300 opacity-80',
                shouldTruncate && !isDescriptionExpanded && 'line-clamp-3'
              )}>
              {description.short}
            </p>
            {/* Only show "Read More" button if text is long enough */}
            {shouldTruncate && !isDescriptionExpanded && (
              <button
                onClick={() => setIsDescriptionExpanded(true)}
                className="mt-0.5 text-[13px] font-light tracking-[0.5px] text-highlight">
                {t('general.more', 'mehr')}
              </button>
            )}
          </div>
        )}

        {/* Action Row: Circle Icons + Tickets Button */}
        <div className="flex items-center gap-2 pt-2">
          {/* Camera Icon (22px - slightly larger for optical balance) */}
          <IconButton onClick={onImage} icon={<IconCamera width={22} height={22} />} className="h-10 w-10" />
          {/* Calendar Icon (20px) */}
          <IconButton onClick={onExport} icon={<IconCalendarPlus width={20} height={20} />} className="h-10 w-10" />

          {/* Ticket Button - Full Pill, Yellow Background, Solid Icon, Bold Text */}
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
