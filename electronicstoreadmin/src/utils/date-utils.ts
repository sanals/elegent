/**
 * Date utilities for handling various date formats
 * from the API and converting them to user-friendly formats
 */

/**
 * Converts API date (string or array) to a JavaScript Date object
 *
 * @param dateValue - Date value from API (string or array)
 * @returns JavaScript Date object or null if invalid
 */
export const parseApiDate = (dateValue: string | any[]): Date | null => {
  try {
    // Handle array format [year, month, day, hour, minute, second, nano]
    if (Array.isArray(dateValue)) {
      const [year, month, day, hour, minute, second] = dateValue;
      // Months in JavaScript are 0-based, but Java's LocalDateTime months are 1-based
      return new Date(year, month - 1, day, hour, minute, second);
    } else if (typeof dateValue === 'string') {
      // Handle ISO string format
      return new Date(dateValue);
    }
    return null;
  } catch (error) {
    console.error('Error parsing date:', error, dateValue);
    return null;
  }
};

/**
 * Formats a date value from the API in Indian date format
 *
 * @param dateValue - Date value from API (string or array)
 * @param options - Intl.DateTimeFormatOptions to customize format
 * @returns Formatted date string or fallback message
 */
export const formatDate = (
  dateValue: string | any[],
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }
): string => {
  try {
    const date = parseApiDate(dateValue);

    if (!date || isNaN(date.getTime())) {
      return 'Invalid date';
    }

    return new Intl.DateTimeFormat('en-IN', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error, dateValue);
    return 'Unknown date';
  }
};

/**
 * Gets a timestamp from API date value for comparison/sorting
 *
 * @param dateValue - Date value from API (string or array)
 * @returns Timestamp number or 0 if invalid
 */
export const getTimestamp = (dateValue: string | any[]): number => {
  try {
    const date = parseApiDate(dateValue);
    return date ? date.getTime() : 0;
  } catch {
    return 0;
  }
};
