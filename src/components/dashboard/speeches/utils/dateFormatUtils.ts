
import { format } from 'date-fns';
import { Speech } from '@/types/speech';

/**
 * Formats a date string into a readable format, handling edge cases
 */
export const formatDisplayDate = (date: string | null): string => {
  if (!date || date === "") {
    return 'N/A';
  }
  
  try {
    // Parse the date string to a Date object
    const parsedDate = new Date(date);
    
    // Check if the date is valid
    if (isNaN(parsedDate.getTime())) {
      return 'N/A';
    }
    
    // Format the date
    return format(parsedDate, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error, 'Date value:', date);
    return 'N/A';
  }
};

/**
 * Format the created/modified date for a speech, with special handling for upcoming speeches
 * @param speech The speech object to format dates for
 * @param dateType Whether to format the 'created_at' or 'updated_at' date
 * @returns Formatted date string with appropriate label for upcoming speeches
 */
export const formatSpeechDate = (speech: Speech, dateType: 'created_at' | 'updated_at'): string => {
  // For upcoming speeches that haven't been created yet
  if (speech.isUpcoming) {
    if (dateType === 'created_at') {
      // For created date, show the due date of the upcoming speech
      return `Due Date: ${formatDisplayDate(speech.event_date || '')}`;
    } else {
      // For upcoming speeches, don't show a modified date until they're actually created
      return 'Not created yet';
    }
  }
  
  // For regular speeches, just format the date
  return formatDisplayDate(speech[dateType]);
};

/**
 * Debug helper to log date-related information
 */
export const logSpeechDates = (speeches: any[], componentName: string) => {
  if (speeches.length > 0) {
    speeches.forEach((speech, index) => {
      console.log(`${componentName} - Speech ${index} dates:`, {
        id: speech.id,
        created_at: speech.created_at,
        updated_at: speech.updated_at,
        created_type: typeof speech.created_at,
        updated_type: typeof speech.updated_at
      });
    });
  }
};
