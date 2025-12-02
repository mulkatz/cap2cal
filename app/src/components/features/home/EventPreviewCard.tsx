import React from 'react';
import { CaptureEvent } from '../../../models/CaptureEvent';
import { Clock, MapPin } from 'lucide-react';
import { cn } from '../../../utils';

interface EventPreviewCardProps {
  event: CaptureEvent;
  onClick: () => void;
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
      month: 'short',
      day: 'numeric'
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

export const EventPreviewCard: React.FC<EventPreviewCardProps> = ({ event, onClick }) => {
  const { title, dateTimeFrom, location } = event;

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex h-32 w-64 flex-shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-primaryElevated/60 p-4 backdrop-blur-sm transition-all duration-300',
        'hover:border-highlight/30 hover:bg-primaryElevated/80 active:scale-95'
      )}>
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="h-full w-full bg-[radial-gradient(circle_at_70%_30%,rgba(230,222,77,0.1),transparent_70%)]" />
      </div>

      {/* Content */}
      <div className="relative flex flex-col gap-2">
        {/* Date badge */}
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-highlight/20 px-2.5 py-1 text-xs font-bold text-highlight">
            {formatEventDate(dateTimeFrom?.date)}
          </div>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-left text-sm font-semibold leading-tight text-white">
          {title}
        </h3>
      </div>

      {/* Footer - Time & Location */}
      <div className="relative flex flex-col gap-1">
        {dateTimeFrom?.time && (
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="flex-shrink-0 text-gray-400" />
            <span className="truncate text-xs text-gray-300">{formatTime(dateTimeFrom.time)}</span>
          </div>
        )}
        {location?.city && (
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="flex-shrink-0 text-gray-400" />
            <span className="truncate text-xs text-gray-300">{location.city}</span>
          </div>
        )}
      </div>
    </button>
  );
};
