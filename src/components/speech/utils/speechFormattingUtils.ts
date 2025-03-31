
// If this file doesn't exist yet, I'll create it with proper utilities

export const formatSpeechContent = (content: string): string => {
  if (!content) return '';
  
  // Check if content is JSON with a 'content' field
  if (content.includes('{"content"')) {
    try {
      const parsed = JSON.parse(content);
      return parsed.content || content;
    } catch (e) {
      console.error('Failed to parse JSON content', e);
      return content;
    }
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
  if (content.includes('{"content"')) {
    try {
      const parsed = JSON.parse(content);
      return parsed.content || content;
    } catch (e) {
      console.error('Failed to parse JSON content', e);
      return content;
    }
  }
  
  return content;
};

// Additional formatting utility for rendering HTML content safely
export const createSafeHtml = (content: string): string => {
  const formattedContent = formatSpeechContent(content);
  // Replace newlines with <br> tags for HTML display
  return formattedContent.replace(/\n/g, '<br>');
};
