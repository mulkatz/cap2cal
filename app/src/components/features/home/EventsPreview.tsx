import React, { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/db';
import { EventPreviewCard } from './EventPreviewCard';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../../utils';

interface EventsPreviewProps {
  onEventClick: (eventId: string) => void;
  onSeeAll: () => void;
}

export const EventsPreview: React.FC<EventsPreviewProps> = ({ onEventClick, onSeeAll }) => {
  const { t } = useTranslation();

  // Query upcoming events
  const allEvents = useLiveQuery(() => db.eventItems.toArray());

  // Filter and sort upcoming events
  const upcomingEvents = useMemo(() => {
    if (!allEvents) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return allEvents
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
      })
      .slice(0, 5); // Show max 5 events
  }, [allEvents]);

  // Don't show if no upcoming events
  if (upcomingEvents.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4">
        <h2 className="text-lg font-bold text-white">{t('home.eventsPreview.title', 'Upcoming Events')}</h2>
        <button
          onClick={onSeeAll}
          className={cn(
            'flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-highlight transition-all',
            'hover:bg-highlight/10 active:scale-95'
          )}>
          {t('home.eventsPreview.seeAll', 'See All')}
          <ChevronRight size={16} strokeWidth={3} />
        </button>
      </div>

      {/* Horizontal scroll of event cards */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {upcomingEvents.map((event) => (
          <EventPreviewCard
            key={event.id || event.timestamp}
            event={event}
            onClick={() => onEventClick(event.id || String(event.timestamp))}
          />
        ))}
      </div>
    </div>
  );
};
