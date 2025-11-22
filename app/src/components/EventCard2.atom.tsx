import React from 'react';
import { CaptureEvent } from '../models/CaptureEvent.ts';

// --- Helper Functions & Types (Moved from external files to resolve error) ---

/**
 * A simple utility for conditionally joining class names.
 * @param {...(string | boolean | null | undefined)[]} classes - The classes to join.
 * @returns {string} The joined class names.
 */
const cn = (...classes: (string | boolean | null | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Formats a date string into a more readable format (e.g., "October 17").
 * @param {string} dateString - The ISO date string (e.g., "2025-10-17").
 * @returns {string} The formatted date.
 */
const formattedDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formats a full ISO dateTime string into a time format (e.g., "8:00 PM").
 * @param {string} dateTimeString - The ISO dateTime string (e.g., "2025-10-17T20:00:00").
 * @returns {string} The formatted time.
 */
const formattedTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

// // --- Type Definitions (Moved from external files to resolve error) ---
// // Defining the shape of the event data object.
// type CaptureEvent = {
//   id: string;
//   title: string;
//   kind?: string;
//   location?: {
//     city?: string;
//     address?: string;
//   };
//   dateTimeFrom?: {
//     date?: string;
//     time?: string;
//   };
//   dateTimeTo?: {
//     date?: string;
//     time?: string;
//   };
//   description?: {
//     short?: string;
//   };
//   links?: string[];
//   ticketDirectLink?: string;
//   ticketAvailableProbability?: number;
//   alreadyFetchedTicketLink?: boolean;
//   agenda?: { time: string; description: string }[];
// };

// --- Prop Types ---
type Props = {
  data: CaptureEvent;
  isFavourite: boolean;
  onFavourite: () => void;
  onImage: () => void;
  onExport: () => void; // This will be mapped to the "Add to Calendar" icon
  onTicket?: (link: string) => void;
  onAddress?: () => void;
};

// --- SVG Icon Components ---
const CameraIcon = ({ className }: { className?: string }) => (
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

const CalendarPlusIcon = ({ className }: { className?: string }) => (
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

const StarIcon = ({ className, isFilled }: { className?: string; isFilled?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill={isFilled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

// --- Main Event Card Component ---
export const EventCardAtom2 = ({ data, isFavourite, onFavourite, onImage, onExport, onTicket, onAddress }: Props) => {
  const {
    title,
    kind,
    location,
    dateTimeFrom,
    description,
    ticketDirectLink,
    ticketAvailableProbability,
    alreadyFetchedTicketLink,
  } = data;

  // --- Derived State & Formatters ---
  const primaryDate = dateTimeFrom?.date ? formattedDate(dateTimeFrom.date) : 'TBA';
  const primaryTime =
    dateTimeFrom?.date && dateTimeFrom?.time ? formattedTime(`${dateTimeFrom.date}T${dateTimeFrom.time}`) : '';

  const showTicketButton =
    !!ticketDirectLink ||
    !!alreadyFetchedTicketLink ||
    (!!ticketAvailableProbability && ticketAvailableProbability > 0.7);

  // --- Render ---
  return (
    // <div className="font-sans w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-2xl shadow-black/40 backdrop-blur-sm">
    <div className="font-sans w-full max-w-sm rounded-2xl border border-slate-700 bg-[#1E2939] p-4 shadow-2xl shadow-black/40 backdrop-blur-sm">
      {/* Header Section */}
      <div className="border-b border-slate-700/60 pb-5">
        <p className="text-sm font-medium text-indigo-400">{kind || 'Event'}</p>
        <h1 className="mt-1 text-3xl font-bold text-white">{title}</h1>

        <div className="mt-4 flex items-end justify-between">
          <p className="text-2xl font-semibold text-white">{primaryDate}</p>
          <p className="text-xl font-medium text-slate-300">{primaryTime}</p>
        </div>
      </div>

      {/* Location & Details Section */}
      <div className={cn('py-5', onAddress && 'cursor-pointer')} onClick={onAddress}>
        <h2 className="text-lg font-bold tracking-widest text-white">{location?.city?.toUpperCase() || 'Location'}</h2>
        <p className="text-sm text-slate-400">{location?.address || 'Venue details unavailable'}</p>

        {description?.short && <p className="mt-4 text-sm leading-relaxed text-slate-300">{description.short}</p>}
      </div>

      {/* Action Icons Section */}
      <div className="mb-5 flex items-center justify-between space-x-3">
        {/* Camera Button */}
        <button
          onClick={onImage}
          className="group flex-1 rounded-xl bg-slate-700/50 p-3 text-slate-400 transition-all duration-200 ease-in-out hover:bg-slate-700/80 hover:text-white active:bg-slate-700">
          <CameraIcon className="mx-auto h-6 w-6 transition-transform group-hover:scale-110 group-active:scale-95" />
        </button>

        {/* Export/Calendar Button */}
        <button
          onClick={onExport}
          className="group flex-1 rounded-xl bg-slate-700/50 p-3 text-slate-400 transition-all duration-200 ease-in-out hover:bg-slate-700/80 hover:text-white active:bg-slate-700">
          <CalendarPlusIcon className="mx-auto h-6 w-6 transition-transform group-hover:scale-110 group-active:scale-95" />
        </button>

        {/* Favourite/Star Button */}
        <button
          onClick={onFavourite}
          className={cn(
            'group flex-1 rounded-xl bg-slate-700/50 p-3 text-slate-400 transition-all duration-200 ease-in-out hover:bg-slate-700/80 active:bg-slate-700',
            isFavourite ? 'text-yellow-400 hover:text-yellow-300' : 'hover:text-white'
          )}>
          <StarIcon
            isFilled={isFavourite}
            className="mx-auto h-6 w-6 transition-transform group-hover:scale-110 group-active:scale-95"
          />
        </button>
      </div>

      {/* Purchase Button - Conditionally Rendered */}
      {showTicketButton && (
        <button
          onClick={() => onTicket && ticketDirectLink && onTicket(ticketDirectLink)}
          className="w-full transform rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3.5 text-center font-bold text-white shadow-lg shadow-indigo-500/30 transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-indigo-500/50 active:scale-95">
          Tickets kaufen
        </button>
      )}
    </div>
  );
};
