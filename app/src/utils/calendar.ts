/**
 * Calendar Utilities
 * Functions for creating calendar links and handling calendar events
 */

import { CaptureEvent } from '../models/CaptureEvent.ts';

export const openICal = async (iCalString: string) => {
  const blob = new Blob([iCalString], { type: 'text/calendar' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'event.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const openATag = (href: string, title = 'event') => {
  const a = document.createElement('a');
  a.href = href;
  a.download = `${title}.ics`;
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

function formatDateForOutlook(date: Date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export const createGoogleCalendarLink = (event: CaptureEvent): string | null => {
  const { title, description, dateTimeFrom, dateTimeTo, location } = event;

  if (!dateTimeFrom || !dateTimeFrom.date) return null;

  const hasStartTime = !!dateTimeFrom.time;
  const hasEndTime = !!dateTimeTo?.time;
  const isFullDay = !hasStartTime;

  let startDateTimeIso: string;
  let endDateTimeIso: string;

  if (isFullDay) {
    const formatToYMD = (date: Date): string => {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    startDateTimeIso = dateTimeFrom.date.replace(/-/g, '');
    const startDate = new Date(`${dateTimeFrom.date}T00:00:00Z`);
    startDate.setDate(startDate.getDate() + 1);
    endDateTimeIso = formatToYMD(startDate);
  } else {
    const startDateTime = new Date(`${dateTimeFrom.date}T${dateTimeFrom.time}`);
    startDateTimeIso = formatToGoogleCalendarDate(startDateTime);

    let endDateTime: Date;
    if (hasEndTime) {
      const endDate = dateTimeTo!.date || dateTimeFrom.date;
      endDateTime = new Date(`${endDate}T${dateTimeTo!.time}`);
    } else {
      endDateTime = new Date(startDateTime.getTime() + 90 * 60 * 1000);
    }
    endDateTimeIso = formatToGoogleCalendarDate(endDateTime);
  }

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

  const eventLocation = encodeURIComponent(locationString);

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${startDateTimeIso + '%2F' + endDateTimeIso}&details=${encodeURIComponent(
    description?.short || ''
  )}&location=${eventLocation}&sf=true&output=xml`;
};

export const createAppleCalendarLink = (event: CaptureEvent): string | null => {
  const { title, description, dateTimeFrom, dateTimeTo, location } = event;

  if (!dateTimeFrom || !dateTimeFrom.date) return null;

  const hasStartTime = !!dateTimeFrom.time;
  const hasEndTime = !!dateTimeTo?.time;
  const isFullDay = !hasStartTime;

  let startDateTime: Date;
  let endDateTime: Date;
  const timeZone = 'Europe/Berlin';

  if (isFullDay) {
    startDateTime = new Date(`${dateTimeFrom.date}T00:00:00Z`);
    endDateTime = new Date(startDateTime.getTime());
    endDateTime.setDate(endDateTime.getDate() + 1);
  } else {
    startDateTime = new Date(`${dateTimeFrom.date}T${dateTimeFrom.time}`);

    if (hasEndTime) {
      const endDate = dateTimeTo!.date || dateTimeFrom.date;
      endDateTime = new Date(`${endDate}T${dateTimeTo!.time}`);
    } else {
      endDateTime = new Date(startDateTime.getTime() + 90 * 60 * 1000);
    }
  }

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

  let dtstart: string;
  let dtend: string;

  if (isFullDay) {
    const formatToYMD = (date: Date): string => {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    dtstart = `DTSTART;VALUE=DATE:${formatToYMD(startDateTime)}`;
    dtend = `DTEND;VALUE=DATE:${formatToYMD(endDateTime)}`;
  } else {
    dtstart = `DTSTART;TZID=${timeZone}:${formatDateToICSWithTimeZone(startDateTime, timeZone)}`;
    dtend = `DTEND;TZID=${timeZone}:${formatDateToICSWithTimeZone(endDateTime, timeZone)}`;
  }

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Your App//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@yourapp.com`,
    dtstart,
    dtend,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description?.long || description?.short || ''}`,
    `LOCATION:${locationString}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const iCalString = lines.join('\r\n');
  const blob = new Blob([iCalString], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);

  return url;
};

export function createOutlookCalendarLink(event: CaptureEvent) {
  const { title, description, dateTimeFrom, dateTimeTo, location } = event;

  if (!dateTimeFrom || !dateTimeFrom.date) return null;

  const hasStartTime = !!dateTimeFrom.time;
  const isFullDay = !hasStartTime;

  let startDateTime: Date;
  let endDateTime: Date;

  if (isFullDay) {
    startDateTime = new Date(`${dateTimeFrom.date}T00:00:00Z`);
    endDateTime = new Date(startDateTime.getTime());
    endDateTime.setDate(endDateTime.getDate() + 1);
  } else {
    startDateTime = new Date(`${dateTimeFrom.date}T${dateTimeFrom.time}`);
    if (dateTimeTo?.time) {
      const endDate = dateTimeTo.date || dateTimeFrom.date;
      endDateTime = new Date(`${endDate}T${dateTimeTo.time}`);
    } else {
      endDateTime = new Date(startDateTime.getTime() + 90 * 60 * 1000);
    }
  }

  let locationString = '';
  if (location?.address || location?.city) {
    locationString = [location.address, location.city].filter(Boolean).join(', ');
  }

  const startISO = formatDateForOutlook(startDateTime);
  const endISO = formatDateForOutlook(endDateTime);

  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
    title
  )}&startdt=${startISO}&enddt=${endISO}&body=${encodeURIComponent(
    description?.short || ''
  )}&location=${encodeURIComponent(locationString)}&allday=${isFullDay ? 'true' : 'false'}`;
}
