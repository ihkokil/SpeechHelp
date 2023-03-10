
/**
 * Utility functions for handling speech content
 */

/**
 * Creates a placeholder speech based on provided details
 */
export const createPlaceholderSpeech = (title: string, speechDetails: Record<string, string> = {}): string => {
  const detailsArray = Object.entries(speechDetails || {});
  
  if (detailsArray.length === 0) {
    return "This is your generated speech. You can edit it here to customize it to your needs.";
  }
  
  let speech = `# ${title}\n\n`;
  speech += "## Your Speech Details\n\n";
  
  detailsArray.forEach(([question, answer]) => {
    if (answer && answer.trim()) {
      speech += `**${question}**\n${answer}\n\n`;
    }
  });
  
  speech += "\n---\n\nEdit this speech to your liking before saving.";
  return speech;
};
