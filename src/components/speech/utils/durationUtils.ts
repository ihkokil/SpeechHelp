
/**
 * Utilities for handling speech duration
 */

/**
 * Estimates the speech duration based on word count (average speaking rate)
 * @param text Speech text content
 * @returns Estimated duration in minutes
 */
export const estimateSpeechDuration = (text: string): number => {
  const words = text.trim().split(/\s+/).length;
  // Average speaking rate is about 130 words per minute
  return words / 130;
};

/**
 * Parses the duration from user input to minutes
 * @param durationInput User input for duration (e.g., "5 minutes", "1 hour", "30 min")
 * @returns Duration in minutes (defaults to 5 if parsing fails)
 */
export const parseDurationToMinutes = (durationInput: string): number => {
  if (!durationInput) return 5; // Default duration
  
  const input = durationInput.toLowerCase().trim();
  
  // Handle hour formats (1 hour, 2 hrs, 1.5 hours)
  if (input.includes('hour') || input.includes('hr')) {
    const hourMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:hour|hr)/);
    if (hourMatch) {
      const hours = parseFloat(hourMatch[1]);
      return hours * 60; // Convert hours to minutes
    }
  }
  
  // Handle minute formats (30 minutes, 5 mins, 10 min)
  if (input.includes('minute') || input.includes('min')) {
    const minuteMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:minute|min)/);
    if (minuteMatch) {
      return parseFloat(minuteMatch[1]);
    }
  }

  // Handle time formats (like "2:30" for 2.5 minutes, "0:30" for 30 seconds = 0.5 minutes)
  const timeMatch = input.match(/(\d+):(\d+)/);
  if (timeMatch) {
    const minutes = parseInt(timeMatch[1]);
    const seconds = parseInt(timeMatch[2]);
    return minutes + (seconds / 60);
  }

  // Handle seconds (30 seconds, 90 sec)
  if (input.includes('second') || input.includes('sec')) {
    const secondMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:second|sec)/);
    if (secondMatch) {
      const seconds = parseFloat(secondMatch[1]);
      return seconds / 60; // Convert seconds to minutes
    }
  }
  
  // Handle simple number formats
  const numberMatch = input.match(/(\d+(?:\.\d+)?)/);
  if (numberMatch) {
    const number = parseFloat(numberMatch[1]);
    
    // Better logic for numbers without units
    if (number >= 60) {
      // Large numbers likely meant as minutes (e.g., "90" = 90 minutes)
      return number;
    } else if (number >= 10) {
      // Medium numbers likely minutes (e.g., "15" = 15 minutes)
      return number;
    } else if (number <= 3) {
      // Small numbers could be hours (e.g., "2" = 2 hours)
      // But only if context suggests it (no min/minute in input)
      if (!input.includes('min')) {
        return number * 60;
      }
      return number; // Assume minutes if 'min' was mentioned
    } else {
      // Numbers between 3-10, assume minutes
      return number;
    }
  }
  
  return 5; // Default to 5 minutes if parsing fails
};
