import React from 'react';

// --- SVG Icon Components (Refined for a cleaner look) ---

const CameraIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
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

const CalendarPlusIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
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

const StarIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

// --- Main App Component ---
export default function App() {
  return (
    // Centering container with a subtle gradient background
    <div className="font-sans flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#0a101f] to-[#1f2937] p-4">
      {/* --- Concert Ticket Component --- */}
      <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-800/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
        {/* Header Section */}
        <div className="border-b border-slate-700/60 pb-5">
          <p className="text-sm font-medium text-indigo-400">Konzert</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Tom Hengst - High Stakes Tour 2025</h1>

          <div className="mt-4 flex items-end justify-between">
            <p className="text-2xl font-semibold text-white">17. Oktober</p>
            <p className="text-xl font-medium text-slate-300">20 Uhr</p>
          </div>
        </div>

        {/* Location & Details Section */}
        <div className="py-5">
          <h2 className="text-lg font-bold tracking-widest text-white">BERLIN</h2>
          <p className="text-sm text-slate-400">HUXLEY'S NEUE WELT</p>

          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Erleben Sie Tom Hengst live auf seiner High Stakes Tour 2025! Freuen Sie sich auf einen unvergesslichen
            Abend voller Musik und Unterhaltung.
          </p>
        </div>

        {/* Action Icons Section */}
        <div className="mb-5 flex items-center justify-between space-x-3">
          {['camera', 'calendar', 'star'].map((icon) => (
            <button
              key={icon}
              className="group flex-1 rounded-xl bg-slate-700/50 p-3 text-slate-400 transition-all duration-300 ease-in-out hover:bg-slate-700/80 hover:text-white">
              {icon === 'camera' && (
                <CameraIcon className="mx-auto h-6 w-6 transition-transform group-hover:scale-110" />
              )}
              {icon === 'calendar' && (
                <CalendarPlusIcon className="mx-auto h-6 w-6 transition-transform group-hover:scale-110" />
              )}
              {icon === 'star' && <StarIcon className="mx-auto h-6 w-6 transition-transform group-hover:scale-110" />}
            </button>
          ))}
        </div>

        {/* Purchase Button - Primary Call to Action */}
        <button className="w-full transform rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3.5 text-center font-bold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-indigo-500/50">
          Tickets kaufen
        </button>
      </div>
    </div>
  );
}
