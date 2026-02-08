import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';

//Whenever day.js encounters an invalid date in the current locale, it will display the string "-"
dayjs.extend(updateLocale);
dayjs.updateLocale(dayjs.locale(), { invalidDate: '-' });

// Export the date and time format constants
export const INSTANT_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS';
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const ORDINAL_DATE_FORMAT = 'YYYY-MM-DD HH:mm';
export const DATE_FORMAT = 'YYYY-MM-DD';

// Export the date and time formatting functions
export const formatInstant = (date: any) => dayjs(date).format(INSTANT_FORMAT);
export const formatDateTime = (date: any) => dayjs(date).format(DATE_TIME_FORMAT);
export const formatOrdinalDate = (date: any) => dayjs(date).format(ORDINAL_DATE_FORMAT);
export const formatDate = (date: any) => dayjs(date).format(DATE_FORMAT);
export const getDateNow = () => formatInstant(new Date());
export const customFormatDate = (date: any, format: string) => dayjs(date).format(format);

// all values are indicated in milliseconds
export const SECOND = 1000;
export const MINUTE = 60000;
export const HOUR = 3600000;

/**
 * Check if @timestamp date will expire in 10 seconds
 *
 * @param {any} timestamp date in timestamp
 * @returns {boolean}
 */
export const isPreExpired = (timestamp: any) => Date.now() > timestamp - 10 * SECOND;
