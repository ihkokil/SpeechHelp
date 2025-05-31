
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
 * @param durationInput User input for duration (e.g., "5 minutes")
 * @returns Duration in minutes (defaults to 5 if parsing fails)
 */
export const parseDurationToMinutes = (durationInput: string): number => {
  if (!durationInput) return 5; // Default duration
  
  // Extract numbers from the input
  const match = durationInput.match(/\d+/);
  if (match) {
    return parseInt(match[0], 10);
  }
  
  return 5; // Default to 5 minutes if parsing fails
};
