import { marked } from 'marked';

/**
 * Formats speech content for display, handling both raw text and structured content
 */
export const formatSpeechContent = (content: string): string => {
  try {
    // Check if content is a JSON string
    const parsedContent = JSON.parse(content);
    
    // If it has a content property, use that
    if (parsedContent.content) {
      return marked.parse(parsedContent.content);
    }
    
    // Otherwise, just return the parsed content as a string
    return marked.parse(content);
  } catch (e) {
    // Not valid JSON, just use as-is
    return marked.parse(content);
  }
};

/**
 * Gets the editable content from the speech content string
 */
export const getEditableContent = (content: string): string => {
  try {
    // Check if content is a JSON string
    const parsedContent = JSON.parse(content);
    
    // If it has a content property, use that
    if (parsedContent.content) {
      return parsedContent.content;
    }
    
    // Otherwise, just return the original content
    return content;
  } catch (e) {
    // Not valid JSON, just use as-is
    return content;
  }
};

/**
 * Extracts the language code from speech content if available
 */
export const getContentLanguage = (content: string): string | null => {
  try {
    const parsedContent = JSON.parse(content);
    if (parsedContent.metadata?.language) {
      return parsedContent.metadata.language;
    }
    return null;
  } catch (e) {
    return null;
  }
};

/**
 * Additional formatting utility for rendering HTML content safely
 */
export const createSafeHtml = (content: string): string => {
  const formattedContent = formatSpeechContent(content);
  // Replace newlines with <br> tags for HTML display
  return formattedContent.replace(/\n/g, '<br>');
};

/**
 * Extract key information from the speech content
 */
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

/**
 * Create a questions and answers section
 */
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
