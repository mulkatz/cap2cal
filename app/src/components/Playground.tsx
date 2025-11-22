import clsx from 'clsx';

export const Playground = () => {
  return (
    <div className={'flex h-screen w-full flex-col justify-center bg-gray-50 p-4'}>
      <EventCard />
    </div>
  );
};
import React from 'react';

// A placeholder SVG icon component for clarity.
// You can replace this with your actual icon library (e.g., Heroicons, Feather).
const PlaceholderIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7" // Example checkmark icon
    />
  </svg>
);

const EventCard = () => {
  return (
    <div className={'stack relative'}>
      <Content withBorder={true} z={0} />
      <div className="absolute left-0 top-0 h-[100px] -translate-y-full rounded-t-md border border-b-0 border-gray-400 bg-neutral-100 px-4 py-2 shadow-[0px_0px_8px_2px_rgba(0,0,0,0.33)]">
        <div className={'relative'}>
          <h3 className="text-base font-bold tracking-wide text-stone-950">Ausstellung</h3>
        </div>
        <span className={'absolute left-0 z-30 h-[100px] w-full bg-white'}></span>
      </div>
      <Content withBorder={false} z={30} />
    </div>
  );
};

export default EventCard;

export const Content = ({ withBorder, z }: { withBorder: boolean; z: number }) => {
  return (
    <div className={`absolute w-full bg-gray-50 text-left font-['Plus_Jakarta_Sans'] z-[${z}]`}>
      <div
        className={clsx(
          'z-10 flex w-full flex-col rounded-b-[10px] rounded-tr-[10px] border border-gray-400 bg-neutral-100',
          withBorder && 'shadow-[0px_0px_8px_2px_rgba(0,0,0,0.33)]'
        )}>
        {/* Card Body: Takes up remaining space and pushes footer to the bottom */}
        <div className="flex h-full flex-col justify-between p-2.5">
          {/* Top Section: Date, Title, Location, Tags */}
          <div className="flex flex-col gap-4">
            {/* Date and Time Info */}
            <div className="flex h-11 w-full items-center rounded-md border border-gray-400 bg-slate-300 px-4">
              <div className="flex items-center gap-2">
                {/* Replace with actual calendar icon */}
                {/*<div className="h-5 w-4 bg-black"></div>*/}
                <span className="mr-2 text-xs font-normal text-black">DI</span>
              </div>
              <div className={'flex w-full justify-between'}>
                <div className={'flex'}>
                  <span className="mr-0.5 text-xs font-extrabold text-black">13. </span>
                  <span className="mr-[4px] text-xs font-extrabold text-black">Oktober</span>
                </div>
                <span className="text-xs font-medium text-black">13 bis 17 Uhr</span>
              </div>
            </div>

            {/* Event Details */}
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-normal text-slate-900">Museum öffnet Welten</h2>
              <p className="font-semibold text-slate-900">Berlin</p>
              <p className="text-xs font-light text-slate-900">13353 Wedding, Föhrer Straße 12</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-300/80 px-3 py-1 text-xs font-normal text-slate-600">
                Ausstellung
              </span>
              <span className="rounded-full bg-slate-300/80 px-3 py-1 text-xs font-normal text-slate-600">
                interaktiv
              </span>
              <span className="rounded-full bg-slate-300/80 px-3 py-1 text-xs font-normal text-slate-600">
                kinderfreundlich
              </span>
            </div>

            {/* Description */}
            <p className="text-base font-normal leading-snug text-slate-900">
              Here is the event card layout you requested, designed to display all your event information with a clean
              and modern look. The layout includes a bold title, a Here is the event card layout you requested, designed
              to display all your event information...
            </p>
          </div>

          {/* Bottom Section (Footer): Action buttons */}
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Favorite Button */}
              <button className="flex h-10 w-9 items-center justify-center rounded-md bg-slate-500 text-white">
                {/* Replace with Heart Icon SVG */}
                <PlaceholderIcon className="h-5 w-5" />
              </button>
              {/* Another action circle */}
              <div className="h-5 w-5 rounded-full bg-slate-300"></div>
            </div>

            {/* Main Action Button */}
            <button className="flex h-10 w-24 items-center justify-center gap-2 rounded-md bg-slate-500 text-white">
              <div className="h-2 w-2 rounded-full bg-white"></div>
              {/* Arrow Icon made from divs, replaced with a placeholder */}
              <PlaceholderIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* An extra div for a potential full-width button at the very bottom, if needed. */}
        {/* If not needed, you can remove this and the parent container's padding. */}
        {/* <div className="h-12 w-full rounded-md bg-slate-500 p-4"></div> */}
      </div>
    </div>
  );
};
