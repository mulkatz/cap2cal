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
import { findTickets } from '../../../services/api';

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
    const [isPreparingShare, setIsPreparingShare] = useState(false);

    // Check if we're in share variant mode
    const isShareVariant = variant === 'share';

    // Refs for the card elements
    const cardRef = useRef<HTMLDivElement>(null); // Default variant (visible)
    const shareCardRef = useRef<HTMLDivElement>(null); // Share variant (hidden, for PDF only)
    const shareCardContainerRef = useRef<HTMLDivElement>(null); // Container for share card (to control visibility)

    // Refs for interactive elements (to measure positions for PDF clickable areas)
    const locationRef = useRef<HTMLDivElement>(null);
    const ticketButtonRef = useRef<HTMLDivElement>(null);
    const footerLinkRef = useRef<HTMLAnchorElement>(null);

    // Screenshot hook (pixelRatio: 2 for high quality)
    const PIXEL_RATIO = 2;
    const { takeScreenshot, isCapturing } = useEventCardScreenshot({ format: 'png', pixelRatio: PIXEL_RATIO });

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
      ticketSearchQuery,
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

    // Handle share button click - fetch tickets if needed, generate PDF and share
    const handleShare = async () => {
      if (!shareCardRef.current || !shareCardContainerRef.current) {
        console.error('Share card ref not available');
        return;
      }

      // Keep dialog open with loading state
      setIsPreparingShare(true);

      try {
        // 1. Check if we need to fetch ticket link first
        let currentTicketLink = ticketDirectLink || alreadyFetchedTicketLink;

        if (!currentTicketLink && alreadyFetchedTicketLink === undefined && ticketSearchQuery) {
          // Need to fetch ticket link
          console.log('[handleShare] Fetching ticket link before PDF generation...');
          const ticketResult = await findTickets(ticketSearchQuery, i18n.language);

          if (ticketResult && ticketResult.ticketLinks.length > 0) {
            currentTicketLink = ticketResult.ticketLinks[0];
            // Update database with fetched link
            await db.eventItems.update(data, { ...data, alreadyFetchedTicketLink: currentTicketLink });
          } else {
            // No tickets found, mark as null
            await db.eventItems.update(data, { ...data, alreadyFetchedTicketLink: null });
            currentTicketLink = null;
          }

          // Wait for database update to propagate to useLiveQuery observers
          console.log('[handleShare] Waiting for database update to propagate...');
          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        // 2. Pre-load the event image if it exists (critical for iOS)
        if (data.img?.dataUrl) {
          console.log('[handleShare] Pre-loading event image...');
          const imageDataUrl = data.img.dataUrl; // Store in variable for TypeScript
          try {
            const img = new Image();
            await new Promise<void>((resolve, reject) => {
              img.onload = () => {
                console.log('[handleShare] Event image loaded successfully:', img.width, 'x', img.height);
                resolve();
              };
              img.onerror = (e) => {
                console.error('[handleShare] Event image failed to load:', e);
                reject(e);
              };
              img.src = imageDataUrl;
            });

            // Ensure image is fully decoded
            if (img.decode) {
              await img.decode();
              console.log('[handleShare] Event image decoded successfully');
            }
          } catch (error) {
            console.error('[handleShare] Error pre-loading image:', error);
            // Continue anyway - screenshot might work without it
          }
        }

        // 3. Move share card on-screen for screenshot
        console.log('[handleShare] Moving share card on-screen for screenshot...');
        const originalLeft = shareCardContainerRef.current.style.left;
        shareCardContainerRef.current.style.left = '0px';

        // Wait for browser to paint the share card
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

        // 3.5. Wait for TicketButton to render if it should be shown
        // TicketButton uses useLiveQuery which is async, so we need to wait for it
        const shouldShowTicketButton =
          showTicketButton && (ticketDirectLink || alreadyFetchedTicketLink) && alreadyFetchedTicketLink !== null;

        if (shouldShowTicketButton && ticketButtonRef.current) {
          console.log('[handleShare] Waiting for ticket button to render...');
          const maxWaitTime = 3000; // Max 3 seconds
          const startTime = Date.now();

          // Poll until the ticket button has actual button element (not just container div)
          while (Date.now() - startTime < maxWaitTime) {
            // Check if there's an actual button element inside (TicketButton renders a button)
            const button = ticketButtonRef.current.querySelector('button');
            if (button && button.offsetHeight > 0) {
              console.log('[handleShare] Ticket button rendered successfully', button.offsetHeight);
              // Extra wait to ensure full paint
              await new Promise((resolve) => setTimeout(resolve, 100));
              break;
            }
            // Wait 50ms before checking again
            await new Promise((resolve) => setTimeout(resolve, 50));
          }

          const finalButton = ticketButtonRef.current.querySelector('button');
          if (!finalButton || finalButton.offsetHeight === 0) {
            console.warn('[handleShare] Ticket button did not render in time', {
              hasButton: !!finalButton,
              buttonHeight: finalButton?.offsetHeight,
              containerHeight: ticketButtonRef.current.offsetHeight,
              containerChildren: ticketButtonRef.current.children.length,
            });
          }
        }

        console.log('[handleShare] Share card ready, taking screenshot...');

        // 4. Capture the share variant card as screenshot (includes photo + branding)
        const cardScreenshotDataUrl = await takeScreenshot(shareCardRef.current);
        console.log('[handleShare] Screenshot captured, dataUrl length:', cardScreenshotDataUrl?.length || 0);

        // 5. Move the share card back off-screen
        shareCardContainerRef.current.style.left = originalLeft;

        if (!cardScreenshotDataUrl) {
          console.error('Failed to capture card screenshot');
          shareCardContainerRef.current.style.left = originalLeft;
          setIsPreparingShare(false);
          setShowActionSheet(false);
          return;
        }

        // 6. Measure interactive element positions relative to card
        const cardRect = shareCardRef.current.getBoundingClientRect();

        // Helper to measure an element's position relative to the card
        const measureElement = (ref: React.RefObject<HTMLElement>) => {
          if (!ref.current) return null;
          const rect = ref.current.getBoundingClientRect();
          return {
            x: rect.left - cardRect.left, // Position relative to card
            y: rect.top - cardRect.top,
            width: rect.width,
            height: rect.height,
          };
        };

        // Measure each interactive element (only if they should be rendered)
        const shouldRenderTicketButton = showTicketButton && currentTicketLink && currentTicketLink !== null;
        const locationMeasurement = location ? measureElement(locationRef) : null;
        const ticketButtonMeasurement = shouldRenderTicketButton ? measureElement(ticketButtonRef) : null;
        const footerLinkMeasurement = measureElement(footerLinkRef);

        // 7. Prepare location data for clickable link (if available)
        let locationText: string | undefined;
        let locationUrl: string | undefined;

        if (location) {
          locationText = formatLocation(location.city, location.address);
          // Create Google Maps search URL
          const searchQuery = encodeURIComponent(locationText);
          locationUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
        }

        // 8. Prepare ticket URL (if available)
        const ticketUrl =
          currentTicketLink && currentTicketLink !== null
            ? `https://${currentTicketLink.replace(/^(https?:\/\/)?(www\.)?/, 'www.')}`
            : undefined;

        // 9. Generate PDF with tight bounds, dark background, and accurate clickable areas
        const pdfBase64 = await generateEventPdf({
          cardScreenshotDataUrl,
          eventTitle: title || 'Event',
          locationText,
          locationUrl,
          ticketUrl,
          locationMeasurement,
          ticketButtonMeasurement,
          footerLinkMeasurement,
          pixelRatio: PIXEL_RATIO, // Pass pixel ratio for coordinate scaling
        });

        // 10. Generate filename (localized, human-readable)
        const cleanTitle = (title || t('general.newEvent', 'New Event'))
          .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filename characters
          .trim();
        const filename = `${t('share.eventFilename', { title: cleanTitle })}.pdf`;

        // 11. Share message
        const shareMessage = t('share.message', 'Check out this event I found! 🎉');

        // 12. Share or download based on platform
        const platform = Capacitor.getPlatform();

        if (platform === 'web') {
          // On web: Trigger download for testing
          const pdfDataUrl = `data:application/pdf;base64,${pdfBase64}`;
          triggerDownload(pdfDataUrl, filename);
          console.log('PDF downloaded:', filename);
        } else {
          // On native: Use share functionality with message
          await sharePdfFile(pdfBase64, filename, shareMessage);
          console.log('PDF shared:', filename);
        }

        setIsPreparingShare(false);
        setShowActionSheet(false);
      } catch (error) {
        console.error('Failed to generate/share PDF:', error);
        // Make sure to hide the share card even on error
        if (shareCardContainerRef.current) {
          shareCardContainerRef.current.style.left = '-9999px';
        }
        setIsPreparingShare(false);
        setShowActionSheet(false);
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
            ref={shareCardContainerRef}
            className="pointer-events-none fixed left-[-9999px] top-0 w-[400px]"
            aria-hidden="true"
            style={{ zIndex: -1000 }}>
            <Card
              ref={shareCardRef}
              highlight={false}
              inline={false}
              usePattern
              className={
                'overflow-hidden border border-white/5 bg-primaryElevated bg-gradient-to-br from-primaryElevated to-primaryElevated/80 shadow-none'
              }>
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
                  <div ref={locationRef} className="mt-1.5 flex items-center gap-2">
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

                {/* Ticket Button (only if ticket link exists, NOT if explicitly null) */}
                {showTicketButton &&
                  (ticketDirectLink || alreadyFetchedTicketLink) &&
                  alreadyFetchedTicketLink !== null && (
                    <div ref={ticketButtonRef} className="flex pt-2">
                      <TicketButton isFavourite={isFavourite} id={id} />
                    </div>
                  )}

                {/* Branding Footer */}
                <div className="mt-4 border-t border-white/10 pt-4 text-center">
                  <a
                    ref={footerLinkRef}
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
                  disabled={isPreparingShare}
                  className="w-full rounded-xl bg-white/5 px-4 py-3.5 text-left text-white transition-colors active:bg-white/10 disabled:opacity-50">
                  <div className="flex items-center gap-3">
                    {isPreparingShare ? (
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                        <polyline points="16 6 12 2 8 6" />
                        <line x1="12" y1="2" x2="12" y2="15" />
                      </svg>
                    )}
                    <span className="font-medium">
                      {isPreparingShare
                        ? t('eventCard.actionSheet.preparing', 'Preparing...')
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
