import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CaptureEvent } from './models/CaptureEvent.ts';
import { format, parse, parseISO } from 'date-fns';
import i18next from 'i18next';

export const openICal = async (iCalString: string) => {
  // Step 2: Create a Blob from the iCalendar string
  const blob = new Blob([iCalString], { type: 'text/calendar' });

  // Step 3: Create a download link and trigger the click event
  const url = window.URL.createObjectURL(blob); // Create an object URL for the Blob
  const link = document.createElement('a'); // Create an anchor element
  link.href = url; // Set the href to the Blob URL
  link.download = 'event.ics'; // Set the file name for download

  document.body.appendChild(link); // Append link to the body (required for Firefox)
  link.click(); // Simulate a click to trigger download
  document.body.removeChild(link); // Clean up by removing the link
  window.URL.revokeObjectURL(url); // Revoke the object URL to free up resources
};
// @ts-ignore
const openAndroidIntent = async (event: {
  eventTitle: string;
  description: string;
  location: string | null;
  beginTime: string; // time in millis
  endTime: string; // time in millis
}) => {
  const { eventTitle, description, location, beginTime, endTime } = event;
  const intentUrl = `intent://calendar/event?action=android.intent.action.INSERT&title=${eventTitle}&description=${description}&location=${location}&beginTime=${beginTime}&endTime=${endTime}#Intent;scheme=https;package=com.google.android.calendar;end`;
  const a = document.createElement('a');
  a.href = intentUrl;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// @ts-ignore
export const openATag = (href: string, title = 'event') => {
  const a = document.createElement('a');
  a.href = href;
  a.download = `${title}.ics`; // Set the file name here
  a.target = '_self';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const formatToGoogleCalendarDate = (date: Date) => {
  return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

function formatDateToICSWithTimeZone(date: Date, timeZone = 'Europe/Berlin') {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone,
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat('en-GB', options as any);
  const parts = formatter.formatToParts(date);

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;
  const hours = parts.find((part) => part.type === 'hour')?.value;
  const minutes = parts.find((part) => part.type === 'minute')?.value;
  const seconds = parts.find((part) => part.type === 'second')?.value;

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

// NOTE: The function 'formatToGoogleCalendarDate' is assumed to be defined elsewhere,
// which formats a Date object into the 'YYYYMMDDT*Z' string format.

// NOTE: The function 'formatToGoogleCalendarDate' is assumed to be defined elsewhere,
// which formats a Date object into the 'YYYYMMDDT*Z' string format.

// NOTE: The function 'formatToGoogleCalendarDate' is assumed to be defined elsewhere,
// and it should correctly format a local Date object into the 'YYYYMMDDT*Z' string format.

export const createGoogleCalendarLink = (event: CaptureEvent): string | null => {
  const { title, description, dateTimeFrom, dateTimeTo, location } = event;

  // 1. Basic Validation: Need at least the starting date.
  if (!dateTimeFrom || !dateTimeFrom.date) return null;

  // Determine the event type based on the presence of time components.
  const hasStartTime = !!dateTimeFrom.time;
  const hasEndTime = !!dateTimeTo?.time;

  // Rule 1: No Start Time -> Full-Day Event
  const isFullDay = !hasStartTime;

  let startDateTimeIso: string;
  let endDateTimeIso: string;

  // ---------------------------------
  // 2. DATE/TIME CALCULATION (Offset Logic Removed)
  // ---------------------------------

  if (isFullDay) {
    // Full-Day Event Logic (dates=YYYYMMDD/YYYYMMDD_PLUS_ONE)

    // Helper to format Date object to YYYYMMDD (UTC)
    const formatToYMD = (date: Date): string => {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    // Start Date (YYYYMMDD) - Use the non-nullable dateTimeFrom.date
    startDateTimeIso = dateTimeFrom.date.replace(/-/g, '');

    // End Date is the day *after* the start date (YYYYMMDD_PLUS_ONE)
    // IMPORTANT: Use T00:00:00Z here ONLY for consistent date arithmetic,
    // as it doesn't affect the final YYYYMMDD output.
    const startDate = new Date(`${dateTimeFrom.date}T00:00:00Z`);
    startDate.setDate(startDate.getDate() + 1);

    endDateTimeIso = formatToYMD(startDate);
  } else {
    // Timed Event Logic (hasStartTime is true)

    // 2a. Calculate Start Date/Time (Created in Local Time)
    // By omitting 'Z' or a specific offset, the Date object is interpreted in the system's local timezone (e.g., CEST/CET).
    const startDateTime = new Date(`${dateTimeFrom.date}T${dateTimeFrom.time}`);

    // Pass the local time directly to the formatter. The formatter must convert it to UTC for the URL.
    startDateTimeIso = formatToGoogleCalendarDate(startDateTime);

    let endDateTime: Date;

    if (hasEndTime) {
      // 2b. End Time Present (Standard Calculation in Local Time)
      const endDate = dateTimeTo!.date || dateTimeFrom.date;
      endDateTime = new Date(`${endDate}T${dateTimeTo!.time}`);
    } else {
      // Rule 2: No End Time -> Default Length of 90 minutes
      // Clone the start date and add 90 minutes (90 * 60 * 1000 milliseconds)
      endDateTime = new Date(startDateTime.getTime() + 90 * 60 * 1000);
    }

    // Pass the local time directly to the formatter.
    endDateTimeIso = formatToGoogleCalendarDate(endDateTime);
  }

  // ---------------------------------
  // 3. LOCATION HANDLING (Unchanged)
  // ---------------------------------

  let locationString = '';
  if (location) {
    const address = location.address?.trim();
    const city = location.city?.trim();

    if (address && city) {
      locationString = `${address}, ${city}`;
    } else if (address) {
      locationString = address;
    } else if (city) {
      locationString = city;
    }
  }

  // URL-encode the final location string
  const eventLocation = encodeURIComponent(locationString);

  // ---------------------------------
  // 4. URL CONSTRUCTION (Unchanged)
  // ---------------------------------

  // Construct the Google Calendar link
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${startDateTimeIso + '%2F' + endDateTimeIso}&details=${encodeURIComponent(
    description?.short || ''
  )}&location=${eventLocation}&sf=true&output=xml`;
};

// NOTE: The function 'formatDateToICSWithTimeZone' is assumed to be defined elsewhere.
// For timed events, it should output YYYYMMDDT* (with TZID=...)
// For all-day events, it should output YYYYMMDD (with VALUE=DATE)

// NOTE: The function 'formatDateToICSWithTimeZone' is assumed to be defined elsewhere.
// For timed events, it should output YYYYMMDDT* (with TZID=...)
// For all-day events, it should output YYYYMMDD (with VALUE=DATE)

export const createAppleCalendarLink = (event: CaptureEvent): string | null => {
  const { title, description, dateTimeFrom, dateTimeTo, location } = event;

  // 1. Basic Validation: Need at least the starting date.
  if (!dateTimeFrom || !dateTimeFrom.date) return null;

  const hasStartTime = !!dateTimeFrom.time;
  const hasEndTime = !!dateTimeTo?.time;

  // Rule 1: No Start Time -> Full-Day Event
  const isFullDay = !hasStartTime;

  let startDateTime: Date;
  let endDateTime: Date;

  // We are fixing the time zone issue by relying on JS Date object's local time interpretation
  // and having formatDateToICSWithTimeZone handle the correct formatting/TZID.
  const timeZone = 'Europe/Berlin';

  // ---------------------------------
  // 2. DATE/TIME CALCULATION
  // ---------------------------------

  if (isFullDay) {
    // Rule 1: Full-Day Event Logic (DTSTART;VALUE=DATE:YYYYMMDD)

    // We only need the start date for the iCalendar DTSTART.
    // DTEND must be the day *after* for a single-day all-day event.
    startDateTime = new Date(`${dateTimeFrom.date}T00:00:00Z`); // Use Z for consistent date math
    endDateTime = new Date(startDateTime.getTime());
    endDateTime.setDate(endDateTime.getDate() + 1);
  } else {
    // Timed Event Logic (hasStartTime is true)

    // 2a. Calculate Start Date/Time (Created in Local Time)
    startDateTime = new Date(`${dateTimeFrom.date}T${dateTimeFrom.time}`);

    if (hasEndTime) {
      // End Time Present (Standard Calculation)
      const endDate = dateTimeTo!.date || dateTimeFrom.date;
      endDateTime = new Date(`${endDate}T${dateTimeTo!.time}`);
    } else {
      // Rule 2: No End Time -> Default Length of 90 minutes
      endDateTime = new Date(startDateTime.getTime() + 90 * 60 * 1000);
    }
  }

  // ---------------------------------
  // 3. LOCATION HANDLING (Refined)
  // ---------------------------------

  let locationString = '';
  if (location) {
    const address = location.address?.trim();
    const city = location.city?.trim();

    // Use ',' separator for iCalendar location
    if (address && city) {
      locationString = `${address}, ${city}`;
    } else if (address) {
      locationString = address;
    } else if (city) {
      locationString = city;
    }
  }
  const eventLocation = locationString;

  // ---------------------------------
  // 4. ICS FILE CONSTRUCTION
  // ---------------------------------

  // DTSTART/DTEND must be formatted differently for all-day vs. timed events in iCalendar
  let dtStartLine: string;
  let dtEndLine: string;

  if (isFullDay) {
    // iCalendar All-Day Format: DTSTART;VALUE=DATE:YYYYMMDD
    // IMPORTANT: Assuming formatDateToICSWithTimeZone handles the VALUE=DATE prefix
    dtStartLine = `DTSTART;VALUE=DATE:${formatDateToICSWithTimeZone(startDateTime)}`;
    dtEndLine = `DTEND;VALUE=DATE:${formatDateToICSWithTimeZone(endDateTime)}`;
  } else {
    // iCalendar Timed Format: DTSTART;TZID=...:YYYYMMDDT*
    dtStartLine = `DTSTART;TZID=${timeZone}:${formatDateToICSWithTimeZone(startDateTime)}`;
    dtEndLine = `DTEND;TZID=${timeZone}:${formatDateToICSWithTimeZone(endDateTime)}`;
  }

  // NOTE: DTSTAMP must be a UTC/Zulu timestamp (ends with Z)
  const icsEvent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:${Date.now()}@capture2calendar
DTSTAMP:${formatDateToICSWithTimeZone(new Date(), 'UTC')}
${dtStartLine}
${dtEndLine}
SUMMARY:${title || 'Event'}
DESCRIPTION:${description?.long || description?.short || ''}
LOCATION:${eventLocation}
END:VEVENT
END:VCALENDAR
`;

  // Encode the ICS data (must be URI encoded for data URL)
  const icsFile = encodeURIComponent(icsEvent.trim());

  // Generate the final webcal URL that opens the Apple Calendar
  return `data:text/calendar;charset=utf8,${icsFile}`;
};

function formatDateForOutlook(date: Date) {
  return date.toISOString();
}

export function createOutlookCalendarLink(event: CaptureEvent) {
  const { title, location, description, dateTimeFrom, dateTimeTo } = event;
  const eventLocation = location ? encodeURIComponent('') : '';

  const startDateTime = new Date(
    dateTimeFrom.time ? `${dateTimeFrom.date}T${dateTimeFrom.time}` : `${dateTimeFrom.date}T00:00:00Z`
  );
  const startDateTimeWithTimeZoneOffset = new Date(
    startDateTime.getTime() + new Date().getTimezoneOffset() * 60 * 1000
  );
  // Combine id and time for the end id (fallback to the start id if not provided)
  const endDateTime = new Date(
    dateTimeTo && dateTimeTo.time
      ? `${dateTimeTo.date}T${dateTimeTo.time}`
      : `${dateTimeTo?.date || dateTimeTo?.date}T23:30:00Z`
  );
  const endDateTimeWithTimeZoneOffset = new Date(endDateTime.getTime() + new Date().getTimezoneOffset() * 60 * 1000);

  return `https://outlook.office.com/calendar/0/deeplink/compose
  ?subject=${encodeURIComponent(title)}
  &body=${encodeURIComponent(description.short)}
  &location=${encodeURIComponent(eventLocation)}
  &startdt=${startDateTimeWithTimeZoneOffset.toISOString()}
  &enddt=${endDateTimeWithTimeZoneOffset.toISOString()}`;
}

export const createAppleCalendarLink2 = (event: CaptureEvent): string | null => {
  const { title, description, dateTimeFrom, dateTimeTo, location } = event;

  if (!dateTimeFrom) return null;

  // Start DateTime (in iCalendar format)
  const startDateTime = new Date(
    dateTimeFrom.time ? `${dateTimeFrom.date}T${dateTimeFrom.time}` : `${dateTimeFrom.date}T00:00:00`
  ).toISOString();

  // End DateTime (fallback to start DateTime if not provided)
  const endDateTime = new Date(
    dateTimeTo && dateTimeTo.time
      ? `${dateTimeTo.date}T${dateTimeTo.time}`
      : `${dateTimeTo?.date || dateTimeFrom.date}T23:30:00`
  ).toISOString();

  // Location (format city and address)
  const eventLocation =
    location && (location.city || location.address) ? `${location.city || ''} ${location.address || ''}`.trim() : '';

  // iCalendar (ICS) format: create an event in `.ics` format
  const icsEvent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:${new Date().getTime()}@capture2calendar
DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '')}Z
DTSTART:${startDateTime.replace(/[-:.]/g, '').slice(0, -5)}Z
DTEND:${endDateTime.replace(/[-:.]/g, '').slice(0, -5)}Z
SUMMARY:${title || 'Event'}
DESCRIPTION:${description?.short || ''}
LOCATION:${eventLocation}
END:VEVENT
END:VCALENDAR
`;

  // Encode the ICS data
  const encodedIcs = encodeURIComponent(icsEvent);

  // Use the webcal:// scheme to trigger Apple Calendar
  return `webcal://data:text/calendar;charset=utf8,${encodedIcs}`;
};

export const cn = (...classes: ClassValue[]) => {
  return twMerge(clsx(classes));
};

export function cutLinkAfterSecondSlash(link: string): string {
  const parts = link.split('/');
  if (parts.length > 2) {
    return `${parts[0]}/${parts[2]}`;
  }
  return link; // Return the original link if it doesn't have enough parts
}

export const disableBounceOverscroll = () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && (window as any).MSStream;
  if (isIOS) {
    document.documentElement.style.overscrollBehavior = 'none';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.body.style.overflow = 'hidden';
  }
};
export const formattedDate = (dateString: string, isShort: boolean) => {
  const userLanguage = i18next.language ? i18next.language : 'en-EN';
  // const userLanguage = 'de-DE';
  return new Date(dateString).toLocaleDateString(userLanguage, {
    day: 'numeric',
    // month: 'short',
    month: 'long',
    ...(isShort ? {} : { year: 'numeric' }), // Conditionally add the year only if isShort is false
  });
};

export const formattedTime = (timeString: string, timeZone = 'Europe/Berlin') => {
  // return new Date(timeString).toLocaleTimeString('de-DE', {
  //   hour: '2-digit',
  //   minute: '2-digit',
  //   timeZone, // Convert from UTC to this timezone
  // });

  return convertLocalTimeToTimeZone(timeString, timeZone);
};

function convertLocalTimeToTimeZone(timeString: string, timeZone: string): string {
  // Parse the timeString as local time and shift to UTC
  const localDate = new Date(timeString); // Assumes timeString is local

  // Create a new Date object that assumes the timeString is in UTC
  // const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
  const utcDate = new Date(localDate.getTime());

  // Convert from UTC to the desired time zone
  return utcDate.toLocaleTimeString(i18next.language, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone, // Desired time zone
  });
}

export function getPlatformAndBrowser() {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // Detect platform from userAgent
  let platformName = 'Unknown';
  if (/android/i.test(userAgent)) {
    platformName = 'Android';
  } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    platformName = 'iOS';
  } else if (/Macintosh|Mac OS X/.test(userAgent)) {
    platformName = 'macOS';
  } else if (/Windows/.test(userAgent)) {
    platformName = 'Windows';
  } else if (/Linux/.test(userAgent)) {
    platformName = 'Linux';
  } else {
    platformName = 'Web';
  }

  // Detect browser and version from userAgent
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';

  if (userAgent.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
    browserVersion = userAgent.match(/Firefox\/([0-9\.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('SamsungBrowser') > -1) {
    browserName = 'Samsung Internet';
    browserVersion = userAgent.match(/SamsungBrowser\/([0-9\.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
    browserName = 'Opera';
    browserVersion = userAgent.match(/Opera|OPR\/([0-9\.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Trident') > -1) {
    browserName = 'Internet Explorer';
    browserVersion = userAgent.match(/rv:([0-9\.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Edge') > -1) {
    browserName = 'Edge';
    browserVersion = userAgent.match(/Edg\/([0-9\.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Chrome') > -1) {
    browserName = 'Chrome';
    browserVersion = userAgent.match(/Chrome\/([0-9\.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Safari') > -1) {
    browserName = 'Safari';
    browserVersion = userAgent.match(/Version\/([0-9\.]+)/)?.[1] || 'Unknown';
  }

  return `${platformName} / ${browserName} / ${browserVersion}`;
}

export function isDevelopmentEnvironment() {
  const url = window.location.href; // Get the current URL from the window object
  const devPattern = /localhost|--[a-zA-Z0-9_-]+-/; // Pattern to match localhost or --something-

  return devPattern.test(url);
}

export const isApplePlatform = () => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  return /iPhone|iPad|iPod|Macintosh/.test(userAgent);
};

export const getSafeAreaTopHeight = () => {
  const safeAreaElement = document.querySelector('.pt-safe');
  if (safeAreaElement) {
    const computedStyle = getComputedStyle(safeAreaElement);
    const paddingTopValue = computedStyle.paddingTop;
    return paddingTopValue; // This will be a string like "20px" or "0px"
  } else {
    return '0px'; // Or handle the case where the element doesn't exist
  }
};

export function transformUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    const parts = parsedUrl.pathname.split('/').filter(Boolean); // Filter empty strings
    let path = parsedUrl.pathname;

    if (parts.length > 1) {
      path = `/${parts[0]}/...`;
    }

    // Return domain + short path
    return `${parsedUrl.hostname}${path}`;
  } catch (e) {
    // Fallback for invalid URLs or simple strings
    const parts = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/');
    if (parts.length > 2) {
      // [domain, part1, part2]
      return `${parts[0]}/${parts[1]}/...`;
    }
    return url.replace(/^(https?:\/\/)?(www\.)?/, '');
  }
}

/**
 * Formats a "HH:mm:ss" time string to a short "HH:mm" format.
 */
export function formatTimeToShort(timeString: string): string | null {
  try {
    const parsedTime = parse(timeString, 'HH:mm:ss', new Date());
    return format(parsedTime, 'HH:mm');
  } catch (error) {
    console.error('Invalid time string:', error);
    return null;
  }
}

export const isSmallScreen = window.screen.height < 680;

// The 'cleanStringForURLQuery' and 'sanitizeLink' functions
// were unused or commented out and have been removed.
