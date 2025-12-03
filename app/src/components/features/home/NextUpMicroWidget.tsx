import React, { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/db';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../../utils';

interface NextUpMicroWidgetProps {
  onEventClick?: () => void;
}

// Format date to readable format
const formatEventDate = (dateStr?: string, locale?: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const eventDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (eventDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (eventDate.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  } else {
    return new Intl.DateTimeFormat(locale || 'en-GB', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }
};

// Format time
const formatTime = (timeStr?: string): string => {
  if (!timeStr) return '';
  try {
    const dummyDate = new Date(`2000-01-01T${timeStr}`);
    return dummyDate.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return timeStr;
  }
};

/**
 * Minimalist "glass capsule" showing next event
 * Vertically centered between logo and capture button
 * Context without clutter
 */
export const NextUpMicroWidget: React.FC<NextUpMicroWidgetProps> = ({ onEventClick }) => {
  const { t, i18n } = useTranslation();

  // Query upcoming events
  const allEvents = useLiveQuery(() => db.eventItems.toArray());

  // Get next upcoming event
  const nextEvent = useMemo(() => {
    if (!allEvents) return null;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const upcoming = allEvents
      .filter((event) => {
        const eventDateStr = event.dateTimeFrom?.date;
        if (!eventDateStr) return false;
        const eventDate = new Date(eventDateStr);
        const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        return eventDateOnly >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(a.dateTimeFrom?.date || 0);
        const dateB = new Date(b.dateTimeFrom?.date || 0);
        return dateA.getTime() - dateB.getTime();
      });

    return upcoming[0] || null;
  }, [allEvents]);

  const hasNoEvents = !allEvents || allEvents.length === 0;

  // If no events at all, show getting started message
  if (hasNoEvents) {
    return (
      <div className="flex flex-col items-center gap-3">
        {/* Headline */}
        <h3 className="text-xs font-medium uppercase tracking-wider text-white/40">
          {t('home.microWidget.headline', 'Upcoming Events')}
        </h3>

        {/* Empty state message */}
        <div
          className={cn(
            'rounded-2xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-sm',
            'animate-fade-in'
          )}>
          <span className="text-sm text-slate-300">
            {t('home.microWidget.startScanning', 'Start scanning events to see them here')}
          </span>
        </div>
      </div>
    );
  }

  // If no upcoming event but has past events, show ready message
  if (!nextEvent) {
    return (
      <div className="flex flex-col items-center gap-3">
        {/* Headline */}
        <h3 className="text-xs font-medium uppercase tracking-wider text-white/40">
          {t('home.microWidget.headline', 'Upcoming Events')}
        </h3>

        {/* No upcoming events message */}
        <div
          className={cn(
            'rounded-2xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-sm',
            'animate-fade-in'
          )}>
          <span className="text-sm text-slate-300">
            {t('home.microWidget.noUpcoming', 'No upcoming events')}
          </span>
        </div>
      </div>
    );
  }

  const { title, dateTimeFrom, id } = nextEvent;
  const formattedDate = formatEventDate(dateTimeFrom?.date, i18n.language);
  const formattedTime = formatTime(dateTimeFrom?.time);

  // Truncate title to ~30 characters for larger display
  const truncatedTitle = title.length > 30 ? `${title.substring(0, 30)}...` : title;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Headline */}
      <h3 className="text-xs font-medium uppercase tracking-wider text-white/40">
        {t('home.microWidget.headline', 'Upcoming Events')}
      </h3>

      {/* Event Widget - larger size */}
      <button
        onClick={() => onEventClick?.()}
        className={cn(
          'group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-sm transition-all',
          'hover:border-highlight/30 hover:bg-white/10 active:scale-[0.98]'
        )}>
        {/* Clock Icon */}
        <Clock size={20} className="flex-shrink-0 text-slate-400 transition-colors group-hover:text-highlight" />

        {/* Event Info */}
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-base font-semibold text-slate-200">{truncatedTitle}</span>
          <span className="text-sm text-slate-400">
            {formattedDate}
            {formattedTime && ` • ${formattedTime}`}
          </span>
        </div>
      </button>
    </div>
  );
};
