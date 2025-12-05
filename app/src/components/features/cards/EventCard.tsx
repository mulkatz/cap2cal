import { IconCalendarPlus, IconCamera, IconStar } from '../../../assets/icons';
import { Clock, MapPin, MoreVertical } from 'lucide-react';
// Import all utilities from a single source
import { cn } from '../../../utils.ts';
import { IconButton } from '../../ui/buttons/IconButton.tsx';
import { CaptureEvent } from '../../../models/CaptureEvent.ts';
import React, { useState, useRef } from 'react';
import { TicketButton } from '../TicketButton.tsx';
import { Card } from './CardGroup.tsx';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../../ui/Dialog.tsx';
import { useEventCardScreenshot } from '../../../hooks/useEventCardScreenshot.tsx';
import { Capacitor } from '@capacitor/core';
import { generateEventPdf, getEventInviteUrl } from '../../../utils/pdfGenerator';
import { db } from '../../../db/db';
import { useShare } from '../../../hooks/useShare';

type Props = {
  data: CaptureEvent;
  isFavourite: boolean;
  onFavourite: () => void;
  onImage: () => void;
  onExport: () => void;
  onDelete: () => void;
  onAddress?: () => void;
  locale?: string; // Dynamic locale prop (e.g., 'en-US', 'de-DE')
  variant?: 'default' | 'share'; // Share variant for PDF generation (no interactive buttons, includes photo)
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

  // Parse the date to extract day, month, and year
  const date = new Date(dateTime.date);
  const day = date.getDate().toString();
  const year = date.getFullYear();
  const currentYear = new Date().getFullYear();

  // Show year only if it differs from current year
  const showYear = year !== currentYear;

  // Use the provided locale or device's current locale
  const month = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date).toUpperCase();

  return (
    <div className="flex w-14 flex-none flex-col overflow-hidden rounded-lg shadow-sm">
      {/* Row 1 - Month (Electric Yellow) */}
      <div className="bg-highlight px-2 py-1.5 text-center">
        <div className="text-[10px] font-bold tracking-wide text-primaryDark">{month}</div>
      </div>
      {/* Row 2 - Day (Dark Navy) */}
      <div className={cn('bg-primaryDark px-2 text-center', showYear ? 'pt-2' : 'py-2')}>
        <div className="text-xl font-bold leading-none text-white">{day}</div>
      </div>
      {/* Row 3 - Year (Conditional - only if different from current year) */}
      {showYear && (
        <div className="bg-primaryDark px-2 pb-1.5 pt-0.5 text-center">
          <div className="text-[10px] font-bold text-gray-400">{year}</div>
        </div>
      )}
    </div>
  );
};

// ## Main Component: EventCardAtom
const EventCardAtom = React.memo(
  ({ data, onFavourite, isFavourite, onImage, onExport, onDelete, onAddress, locale, variant = 'default' }: Props) => {
    const { t, i18n } = useTranslation();
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [showActionSheet, setShowActionSheet] = useState(false);

    // Check if we're in share variant mode
    const isShareVariant = variant === 'share';

    // Refs for the card elements
    const cardRef = useRef<HTMLDivElement>(null); // Default variant (visible)
    const shareCardRef = useRef<HTMLDivElement>(null); // Share variant (hidden, for PDF only)

    // Screenshot hook
    const { takeScreenshot, isCapturing } = useEventCardScreenshot({ format: 'png' });

    // Share hook
    const { sharePdfFile } = useShare();

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

    // Character limit for description truncation (disabled in share variant)
    const TRUNCATE_LENGTH = 120;
    const shouldTruncate = !isShareVariant && description?.short && description.short.length > TRUNCATE_LENGTH;

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

    // Helper: Trigger browser download (web only)
    const triggerDownload = (dataUrl: string, filename: string) => {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // Handle share button click - generate PDF and share
    const handleShare = async () => {
      if (!shareCardRef.current) {
        console.error('Share card ref not available');
        return;
      }

      setShowActionSheet(false);

      try {
        // 1. Capture the share variant card as screenshot (includes photo + branding)
        const cardScreenshotDataUrl = await takeScreenshot(shareCardRef.current);

        if (!cardScreenshotDataUrl) {
          console.error('Failed to capture card screenshot');
          return;
        }

        // 2. Prepare location data for clickable link (if available)
        let locationText: string | undefined;
        let locationUrl: string | undefined;

        if (location) {
          locationText = formatLocation(location.city, location.address);
          // Create Google Maps search URL
          const searchQuery = encodeURIComponent(locationText);
          locationUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
          console.log('PDF: Location data prepared:', { locationText, locationUrl });
        } else {
          console.log('PDF: No location data available');
        }

        // 3. Generate PDF with tight bounds and dark background
        const pdfBase64 = await generateEventPdf({
          cardScreenshotDataUrl,
          eventTitle: title || 'Event',
          locationText,
          locationUrl,
        });

        // 4. Generate filename (localized, human-readable)
        const cleanTitle = (title || t('general.newEvent', 'New Event'))
          .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filename characters
          .trim();
        const filename = `${t('share.eventFilename', { title: cleanTitle })}.pdf`;

        // 5. Share or download based on platform
        const platform = Capacitor.getPlatform();

        if (platform === 'web') {
          // On web: Trigger download for testing
          const pdfDataUrl = `data:application/pdf;base64,${pdfBase64}`;
          triggerDownload(pdfDataUrl, filename);
          console.log('PDF downloaded:', filename);
        } else {
          // On native: Use share functionality
          await sharePdfFile(pdfBase64, filename);
          console.log('PDF shared:', filename);
        }
      } catch (error) {
        console.error('Failed to generate/share PDF:', error);
      }
    };

    // --- Render ---
    return (
      <>
        <Card
          ref={isShareVariant ? shareCardRef : cardRef}
          highlight={isFavourite && !isShareVariant}
          inline
          usePattern
          className={cn(
            'max-h-[60vh] border border-white/5 bg-primaryElevated bg-gradient-to-br from-primaryElevated to-primaryElevated/80',
            isShareVariant ? 'overflow-hidden shadow-none' : 'overflow-hidden shadow-lg'
          )}>
          {/* Event Photo (Share Variant Only) */}
          {isShareVariant && data.img?.id && (
            <div className="w-full">
              <img
                src={data.img.dataUrl}
                alt={title || 'Event'}
                className="h-auto w-full rounded-t-[20px] object-contain"
              />
            </div>
          )}

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

              {/* Favorite Star - Hidden in share variant */}
              {!isShareVariant && (
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
                </button>
              )}
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
                <span className="truncate text-sm font-normal text-gray-100 underline decoration-gray-500/30 decoration-1 underline-offset-4">
                  {formatLocation(location?.city, location?.address)}
                </span>
              </div>
            )}

            {/* Row 5 (Body): Description with Smart Read More */}
            {description?.short && (
              <div className="mb-5 mt-5">
                <p
                  className={cn(
                    'text-[13px] font-normal tracking-[0.5px] text-gray-200 opacity-80',
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

            {/* Row 6 (Footer): Action Buttons + Tickets OR Ticket + Branding */}
            {isShareVariant ? (
              /* Share Variant: Ticket Button + Branding Footer */
              <>
                {/* Ticket Button (if available) */}
                {showTicketButton && (
                  <div className="flex pt-2">
                    <TicketButton isFavourite={isFavourite} id={id} />
                  </div>
                )}

                {/* Branding Footer */}
                <div className="mt-4 border-t border-white/10 pt-4 text-center">
                  <a
                    href="https://cap2cal.app/invite"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-medium text-gray-400 underline decoration-gray-400/50 underline-offset-2 transition-colors hover:text-highlight hover:decoration-highlight/50">
                    Made with <span className="text-red-500">❤</span>{' '}
                    <span className="text-white">Capture2Calendar</span>
                  </a>
                </div>
              </>
            ) : (
              /* Default Variant: Action Buttons */
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
            )}
          </div>
        </Card>

        {/* Hidden Share Variant Card (for PDF generation only) */}
        {!isShareVariant && (
          <div
            className="pointer-events-none fixed left-[-9999px] top-0 w-[400px] opacity-0"
            aria-hidden="true"
            style={{ zIndex: -1000 }}>
            <Card
              ref={shareCardRef}
              highlight={false}
              inline={false}
              usePattern
              className={'overflow-hidden border border-white/5 bg-primaryElevated bg-gradient-to-br from-primaryElevated to-primaryElevated/80 shadow-none'}>
              {/* Event Photo (Share Variant) */}
              {data.img?.id && (
                <div className="w-full">
                  <img
                    src={data.img.dataUrl}
                    alt={title || 'Event'}
                    className="h-auto w-full rounded-t-[20px] object-contain"
                  />
                </div>
              )}

              <div className="flex w-full flex-col p-5">
                {/* Header: Date Badge + Title (no star) */}
                <div className="mb-3 flex items-start gap-3">
                  <DateBadge dateTime={dateTimeFrom} locale={effectiveLocale} />
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
                </div>

                {/* Time */}
                {formattedTime && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-200">{formattedTime}</span>
                  </div>
                )}

                {/* Location */}
                {location && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <MapPin size={14} strokeWidth={2.5} className="flex-shrink-0 text-highlight" />
                    <span className="truncate text-sm font-normal text-gray-100">
                      {formatLocation(location?.city, location?.address)}
                    </span>
                  </div>
                )}

                {/* Description (always expanded) */}
                {description?.short && (
                  <div className="mb-5 mt-5">
                    <p className="text-[13px] font-normal tracking-[0.5px] text-gray-200 opacity-80">
                      {description.short}
                    </p>
                  </div>
                )}

                {/* Ticket Button (if available) */}
                {showTicketButton && (
                  <div className="flex pt-2">
                    <TicketButton isFavourite={isFavourite} id={id} />
                  </div>
                )}

                {/* Branding Footer */}
                <div className="mt-4 border-t border-white/10 pt-4 text-center">
                  <a
                    href="https://cap2cal.app/invite"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-medium text-gray-400 underline decoration-gray-400/50 underline-offset-2">
                    Made with <span className="text-red-500">❤</span>{' '}
                    <span className="text-white">Capture2Calendar</span>
                  </a>
                </div>
              </div>
            </Card>
          </div>
        )}

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
                {/* Share Option */}
                <button
                  onClick={handleShare}
                  disabled={isCapturing}
                  className="w-full rounded-xl bg-white/5 px-4 py-3.5 text-left text-white transition-colors active:bg-white/10 disabled:opacity-50">
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                    <span className="font-medium">
                      {isCapturing
                        ? t('eventCard.actionSheet.capturing', 'Capturing...')
                        : t('eventCard.actionSheet.share', 'Share Event')}
                    </span>
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
