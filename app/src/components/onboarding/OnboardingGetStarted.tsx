import React, { useState } from 'react';
import EventCardAtom from '../EventCard.atom.tsx';
import { CaptureEvent } from '../../models/CaptureEvent.ts';

// Mock Event: Summer Music Festival
// Note: Using a future date to ensure ticket button displays
const getUpcomingDate = () => {
  const date = new Date();
  date.setMonth(6); // July (0-indexed)
  date.setDate(15);
  // If July 15 has passed this year, use next year
  if (date < new Date()) {
    date.setFullYear(date.getFullYear() + 1);
  }
  return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
};

const mockEvent: CaptureEvent = {
  id: 'onboarding-mock-event',
  title: 'Summer Music Festival',
  kind: 'Concert',
  tags: ['music', 'festival'],
  description: {
    short:
      'Join us for an unforgettable evening of live music under the stars. Featuring top artists and bands from around the world.',
  },
  dateTimeFrom: {
    date: getUpcomingDate(),
    time: '20:00',
  },
  dateTimeTo: {
    date: getUpcomingDate(),
    time: '23:00',
  },
  location: {
    city: 'New York',
    address: 'Central Park',
  },
  ticketDirectLink: 'https://example.com/tickets',
  ticketAvailableProbability: 0.95,
  timestamp: Date.now(),
};

export const OnboardingGetStarted: React.FC = () => {
  const [isFavourite] = useState(false);

  // No-op handlers - EventCard is disabled via pointer-events-none
  const noOp = () => {};

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6">
      {/* Content Container */}
      <div className="flex w-full max-w-md flex-col items-center">
        {/* ACTUAL EventCard (Disabled via pointer-events-none) with Massive Shadow */}
        <div className="pointer-events-none relative mb-12 w-full scale-90 select-none shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)]">
          <EventCardAtom
            data={mockEvent}
            isFavourite={isFavourite}
            onFavourite={noOp}
            onImage={noOp}
            onExport={noOp}
            onDelete={noOp}
            onAddress={noOp}
          />
        </div>

        {/* Eyebrow */}
        <p className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-[#E6DE4D]">
          Detect Any Event
        </p>

        {/* Title */}
        <h1 className="mb-4 text-center text-3xl font-bold leading-tight tracking-tight text-white">
          Scans notes, flyers & invites
        </h1>

        {/* Body */}
        <p className="text-center text-base font-medium leading-relaxed text-gray-300">
          Get the complete picture. Buy tickets, navigate to the venue, and export to your calendar with one tap.
        </p>
      </div>
    </div>
  );
};
