
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
  
  // Handle hour formats
  if (input.includes('hour') || input.includes('hr')) {
    const hourMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:hour|hr)/);
    if (hourMatch) {
      const hours = parseFloat(hourMatch[1]);
      return hours * 60; // Convert hours to minutes
    }
  }
  
  // Handle minute formats
  if (input.includes('minute') || input.includes('min')) {
    const minuteMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:minute|min)/);
    if (minuteMatch) {
      return parseFloat(minuteMatch[1]);
    }
  }
  
  // Handle simple number formats (assume minutes)
  const numberMatch = input.match(/(\d+(?:\.\d+)?)/);
  if (numberMatch) {
    const number = parseFloat(numberMatch[1]);
    
    // If the number is very large (like 60+), assume it might be meant as minutes
    // If it's small (like 1-2), it might be hours if no unit specified
    if (number >= 60) {
      return number; // Assume minutes
    } else if (number <= 3 && !input.includes('min')) {
      // Small numbers without 'min' might be hours
      return number * 60;
    } else {
      return number; // Assume minutes
    }
  }
  
  return 5; // Default to 5 minutes if parsing fails
};
