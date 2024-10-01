
import { format } from 'date-fns';

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
