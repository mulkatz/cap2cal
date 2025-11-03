/**
 * Date and Time Utilities
 * Functions for date and time formatting and conversion
 */

import { format, parse } from 'date-fns';
import i18next from 'i18next';

export const formattedDate = (dateString: string, isShort: boolean) => {
  const userLanguage = i18next.language ? i18next.language : 'en-EN';
  return new Date(dateString).toLocaleDateString(userLanguage, {
    day: 'numeric',
    month: 'long',
    ...(isShort ? {} : { year: 'numeric' }),
  });
};

export const formattedTime = (timeString: string, timeZone = 'Europe/Berlin') => {
  return convertLocalTimeToTimeZone(timeString, timeZone);
};

function convertLocalTimeToTimeZone(timeString: string, timeZone: string): string {
  const localDate = new Date(timeString);
  const utcDate = new Date(localDate.getTime());

  return utcDate.toLocaleTimeString(i18next.language, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  });
}

export function formatTimeToShort(timeString: string): string | null {
  try {
    const parsedTime = parse(timeString, 'HH:mm:ss', new Date());
    return format(parsedTime, 'HH:mm');
  } catch (error) {
    return null;
  }
}
