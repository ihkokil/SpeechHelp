
// Utilities for handling speech content formatting

export const formatSpeechContent = (content: string): string => {
  if (!content) return '';
  
  // Check if content is JSON with a 'content' field
  try {
    if (typeof content === 'string' && content.trim().startsWith('{')) {
      const parsed = JSON.parse(content);
      if (parsed.content) {
        return parsed.content;
      }
    }
  } catch (e) {
    console.error('Failed to parse JSON content', e);
  }
  
  return content;
};

export const getEditableContent = (
  content: string, 
  preserveHtml: boolean = false,
  showFormattedContent: boolean = false
): string => {
  if (!content) return '';
  
  // If content is stored as JSON
  try {
    if (typeof content === 'string' && content.trim().startsWith('{')) {
      const parsed = JSON.parse(content);
      if (parsed.content) {
        return parsed.content;
      }
    }
  } catch (e) {
    console.error('Failed to parse JSON content', e);
  }
  
  return content;
};

// Additional formatting utility for rendering HTML content safely
export const createSafeHtml = (content: string): string => {
  const formattedContent = formatSpeechContent(content);
  // Replace newlines with <br> tags for HTML display
  return formattedContent.replace(/\n/g, '<br>');
};

// Extract key information from the speech content
export const extractKeyInformation = (
  content: string | Record<string, string>
): Record<string, string> => {
  try {
    // If content is already a Record/object, return it directly
    if (content && typeof content === 'object') {
      return content;
    }
    
    // If the content is in JSON format, try to extract information
    if (content && typeof content === 'string' && content.trim().startsWith('{')) {
      const parsed = JSON.parse(content);
      // Return any additional fields that might be in the JSON
      const { content: _, ...rest } = parsed;
      return rest;
    }
  } catch (e) {
    console.error('Error extracting key information from speech content', e);
  }
  
  return {};
};

// Create a questions and answers section
export const createQuestionsAnswersSection = (questionsAnswers: Record<string, string>): string => {
  if (!questionsAnswers || Object.keys(questionsAnswers).length === 0) {
    return '';
  }
  
  let section = '## Your Speech Details\n\n';
  
  Object.entries(questionsAnswers).forEach(([question, answer]) => {
    if (answer && answer.trim()) {
      section += `**${question}**\n${answer}\n\n`;
    }
  });
  
  return section;
};
