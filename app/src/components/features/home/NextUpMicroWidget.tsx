import React, { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/db';
import { Clock, Sparkles } from 'lucide-react';
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

  // If no events at all, show motivating onboarding message
  if (hasNoEvents) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 animate-fade-in">
        {/* Glass card with highlight accent */}
        <div
          className={cn(
            'relative flex flex-col items-center gap-3 text-center max-w-[300px]',
            'rounded-3xl border border-highlight/20 bg-white/5 backdrop-blur-sm',
            'px-8 py-6',
            'shadow-[0_0_20px_rgba(230,222,77,0.1)]'
          )}>
          {/* Sparkle icon with highlight glow */}
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-highlight/30 animate-pulse" />
            <Sparkles size={32} className="relative text-highlight" strokeWidth={2} />
          </div>

          {/* Text content */}
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-lg font-bold text-slate-100 tracking-tight">
              {t('home.onboarding.headline', 'Never Miss an Event Again')}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t(
                'home.onboarding.description',
                'Capture any event poster, flyer, or ticket with your camera and instantly save it to your calendar'
              )}
            </p>
          </div>

          {/* Subtle bottom highlight bar */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-16 bg-gradient-to-r from-transparent via-highlight to-transparent opacity-50 rounded-full" />
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
