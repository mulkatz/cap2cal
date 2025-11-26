import { IconCalendarPlus, IconCamera, IconStar } from '../assets/icons';
import { Clock, MapPin, MoreVertical } from 'lucide-react';
// Import all utilities from a single source
import { cn } from '../utils.ts';
import { IconButton } from './buttons/IconButton.tsx';
import { CaptureEvent } from '../models/CaptureEvent.ts';
import React, { useState } from 'react';
import { TicketButton } from './TicketButton.tsx';
import { Card } from './Card.group.tsx';
import { useTranslation } from 'react-i18next';
import { Dialog } from './Dialog.tsx';

type Props = {
  data: CaptureEvent;
  isFavourite: boolean;
  onFavourite: () => void;
  onImage: () => void;
  onExport: () => void;
  onDelete: () => void;
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

// Helper: Format time display from event data with locale support
const formatTimeDisplay = (
  dateTimeFrom?: { date?: string; time?: string },
  dateTimeTo?: { date?: string; time?: string },
  locale?: string
): string | null => {
  const startTime = dateTimeFrom?.time;
  const endTime = dateTimeTo?.time;

  // Case C: No time data
  if (!startTime) return null;

  // Helper to format a single time string
  const formatSingleTime = (timeString: string): string => {
    // Assuming time format is "HH:mm" or "HH:mm:ss"
    // Create a dummy date with the time to use toLocaleTimeString
    const dummyDate = new Date(`2000-01-01T${timeString}`);
    return dummyDate.toLocaleTimeString(locale || 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formattedStart = formatSingleTime(startTime);

  // Case A: Start only
  if (!endTime) return formattedStart;

  // Case B: Start and end (use en-dash with spaces)
  const formattedEnd = formatSingleTime(endTime);
  return `${formattedStart} – ${formattedEnd}`;
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
const EventCardAtom = React.memo(
  ({ data, onFavourite, isFavourite, onImage, onExport, onDelete, onAddress, locale }: Props) => {
    const { t, i18n } = useTranslation();
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [showActionSheet, setShowActionSheet] = useState(false);

    const {
      title,
      kind,
      location,
      dateTimeFrom,
      dateTimeTo,
      description,
      ticketDirectLink,
      id,
      timestamp,
      ticketAvailableProbability,
      alreadyFetchedTicketLink,
    } = data;

    // Use provided locale or fall back to i18n language
    const effectiveLocale = locale || i18n.language;

    // Format time display with locale
    const formattedTime = formatTimeDisplay(dateTimeFrom, dateTimeTo, effectiveLocale);

    // Character limit for description truncation
    const TRUNCATE_LENGTH = 120;
    const shouldTruncate = description?.short && description.short.length > TRUNCATE_LENGTH;

    // Check if event has passed (more than 1 day ago)
    const isEventPassed = () => {
      if (!dateTimeFrom?.date) return false;
      const eventDate = new Date(dateTimeFrom.date);
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return eventDate < oneDayAgo;
    };

    // Extracted complex boolean logic into a readable variable
    // Never show ticket button for events that have passed (1+ day in the past)
    const showTicketButton =
      !isEventPassed() &&
      (!!ticketDirectLink ||
        !!alreadyFetchedTicketLink ||
        (!!ticketAvailableProbability && ticketAvailableProbability >= 0.7));

    // Format location with Title Case (fix ALL CAPS issue)
    const formatLocation = (city?: string, address?: string): string => {
      const parts = [city, address].filter(Boolean).map((part) => toTitleCase(part as string));
      return parts.join(', ');
    };

    // --- Render ---
    return (
      <>
        <Card
          highlight={isFavourite}
          inline
          usePattern
          className={
            'max-h-[60vh] overflow-hidden border border-white/5 bg-primaryElevated bg-gradient-to-br from-primaryElevated to-primaryElevated/80 shadow-lg'
          }>
          <div className="flex w-full flex-col p-5">
            {/* Row 1 (Header): Date Badge + Title + Star */}
            <div className="mb-3 flex items-start gap-3">
              {/* Date Badge */}
              <DateBadge dateTime={dateTimeFrom} locale={effectiveLocale} />

              {/* Title */}
              <div className="flex-1 self-start">
                <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-white">{title}</h3>

                {kind && (
                  <div className="mt-2">
                    <span className="inline-block rounded-full bg-highlight/10 px-2.5 py-1 text-xs font-medium text-highlight">
                      {kind}
                    </span>
                  </div>
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
                  width={20}
                  height={20}
                  className={cn(isFavourite ? 'fill-primaryDark text-primaryDark' : 'fill-gray-400 text-gray-400')}
                />
                {/*<IconStar*/}
                {/*  size={24}*/}
                {/*  className={cn(*/}
                {/*    'transition-colors',*/}
                {/*    isFavourite ? 'text-primaryDark' : 'text-gray-400'*/}
                {/*  )}*/}
                {/*  fill={isFavourite ? 'currentColor' : 'none'}*/}
                {/*/>*/}
              </button>
            </div>

            {/* Row 3 (Time): Dedicated Time row between Category and Location */}
            {formattedTime && (
              <div className="mt-2 flex items-center gap-1.5">
                {/* Clock Icon */}
                <Clock size={16} className="text-gray-400" />
                {/* Time Text */}
                <span className="text-sm font-medium text-gray-200">{formattedTime}</span>
              </div>
            )}

            {/* Row 4 (Location): Pin Icon + City */}
            {location && (
              <div className="mt-1.5 flex cursor-pointer items-center gap-2" onClick={onAddress}>
                <MapPin size={14} strokeWidth={2.5} className="flex-shrink-0 text-highlight" />
                <span className="text-sm font-normal text-gray-100 underline decoration-gray-500/30 decoration-1 underline-offset-4">
                  {formatLocation(location?.city, location?.address)}
                </span>
              </div>
            )}

            {/* Row 5 (Body): Description with Smart Read More */}
            {description?.short && (
              <div className="mb-5 mt-5">
                <p
                  className={cn(
                    'text-[13px] font-normal tracking-[0.5px] text-gray-300 opacity-80',
                    shouldTruncate && !isDescriptionExpanded && 'line-clamp-3'
                  )}>
                  {description.short}
                </p>
                {/* Only show "Read More" button if text is long enough */}
                {shouldTruncate && !isDescriptionExpanded && (
                  <button
                    onClick={() => setIsDescriptionExpanded(true)}
                    className="mt-0.5 text-[13px] font-normal tracking-[0.5px] text-highlight">
                    {t('general.more', 'mehr')}
                  </button>
                )}
              </div>
            )}

            {/* Row 6 (Footer): Action Buttons + Tickets */}
            <div className="flex items-center gap-2 pt-2">
              {/* Three-Dot Menu Button */}
              <IconButton
                onClick={() => setShowActionSheet(true)}
                icon={<MoreVertical size={23} />}
                className="h-10 w-10"
              />
              {/* Camera Icon (22px - slightly larger for optical balance) */}
              <IconButton
                onClick={onImage}
                icon={<IconCamera size={22} />}
                className="h-10 w-10"
                data-testid={`event-image-icon-${id || timestamp}`}
              />
              {/* Calendar Icon (20px) */}
              <IconButton onClick={onExport} icon={<IconCalendarPlus size={20} />} className="h-10 w-10" />

              {/* Ticket Button - Full Pill, Yellow Background, Solid Icon, Bold Text */}
              {showTicketButton && (
                <div className="flex-1">
                  <TicketButton isFavourite={isFavourite} id={id} />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Action Sheet */}
        {showActionSheet && (
          <Dialog onClose={() => setShowActionSheet(false)} closeOnClickOutside>
            <div className="p-6">
              {/* Title */}
              <h2 className="mb-6 text-center text-xl font-semibold text-white">
                {t('eventCard.actionSheet.title', 'Event Options')}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {/* Share Option - Disabled/Placeholder */}
                <button
                  disabled
                  className="w-full rounded-xl bg-white/5 px-4 py-3.5 text-left text-gray-400 opacity-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                    <span className="font-medium">{t('eventCard.actionSheet.share', 'Share Event')}</span>
                    <span className="ml-auto text-xs">({t('eventCard.actionSheet.comingSoon', 'Coming Soon')})</span>
                  </div>
                </button>

                {/* Delete Option - Destructive */}
                <button
                  onClick={() => {
                    setShowActionSheet(false);
                    onDelete();
                  }}
                  className="w-full rounded-xl bg-red-500/10 px-4 py-3.5 text-left text-red-400 transition-colors active:bg-red-500/20">
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm10.618-3L15 2H9L7.382 4H3v2h18V4z" />
                    </svg>
                    <span className="font-semibold">{t('eventCard.actionSheet.delete', 'Delete Event')}</span>
                  </div>
                </button>

                {/* Cancel Option */}
                <button
                  onClick={() => setShowActionSheet(false)}
                  className="w-full rounded-xl bg-white/5 px-4 py-3.5 text-center font-medium text-white transition-colors active:bg-white/10">
                  {t('eventCard.actionSheet.cancel', 'Cancel')}
                </button>
              </div>
            </div>
          </Dialog>
        )}
      </>
    );
  }
);

export default EventCardAtom;
