import React from 'react';
import { Clock, MapPin } from 'lucide-react';

export const OnboardingGetStarted: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6">
      {/* Content Container */}
      <div className="flex w-full max-w-md flex-col items-center">
        {/* Simplified EventCard Mockup */}
        <div className="mb-8 w-full overflow-hidden rounded-2xl border border-white/5 bg-primaryElevated shadow-xl">
          <div className="flex w-full flex-col p-5">
            {/* Header: Date Badge + Title */}
            <div className="mb-3 flex items-start gap-3">
              {/* Date Badge */}
              <div className="flex w-14 flex-none flex-col overflow-hidden rounded-lg shadow-sm">
                <div className="bg-highlight px-2 py-1.5 pt-2 text-center">
                  <div className="text-[10px] font-bold tracking-wide text-primaryDark">JUL</div>
                </div>
                <div className="bg-primaryDark px-2 py-2 text-center">
                  <div className="text-xl font-bold leading-none text-white">15</div>
                </div>
              </div>

              {/* Title */}
              <div className="flex-1">
                <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-white">
                  Summer Music Festival
                </h3>
                <div className="mt-2">
                  <span className="inline-block rounded-full bg-highlight/10 px-2.5 py-1 text-xs font-medium text-highlight">
                    Concert
                  </span>
                </div>
              </div>
            </div>

            {/* Time */}
            <div className="mt-2 flex items-center gap-1.5">
              <Clock size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-200">8:00 PM – 11:00 PM</span>
            </div>

            {/* Location */}
            <div className="mt-1.5 flex items-center gap-2">
              <MapPin size={14} strokeWidth={2.5} className="flex-shrink-0 text-highlight" />
              <span className="text-sm font-normal text-gray-100">Central Park, New York</span>
            </div>

            {/* Description */}
            <div className="mb-5 mt-5">
              <p className="line-clamp-2 text-[13px] font-normal tracking-[0.5px] text-gray-300 opacity-80">
                Join us for an unforgettable evening of live music under the stars. Featuring top artists and bands.
              </p>
            </div>

            {/* Action Buttons with Tickets */}
            <div className="flex items-center gap-2 pt-2">
              {/* Icon Buttons */}
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/50 text-gray-300">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/50 text-gray-300">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
                </svg>
              </button>

              {/* Tickets Button - Hero */}
              <div className="flex-1">
                <button className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-highlight px-4 font-bold text-primaryDark shadow-md transition-all active:scale-95">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span className="text-sm">Tickets</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-center text-3xl font-bold leading-tight text-white">
          Your Calendar, Filled
        </h1>

        {/* Body */}
        <p className="text-center text-lg font-medium leading-relaxed text-gray-300">
          Export to your calendar, share with friends, buy tickets, and never miss a show.
        </p>
      </div>
    </div>
  );
};
