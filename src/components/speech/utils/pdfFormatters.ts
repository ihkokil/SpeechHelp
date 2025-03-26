
/**
 * Formats speech content specifically for PDF export
 * @param text Raw speech content text
 * @returns HTML-formatted string optimized for PDF
 */
export const formatSpeechContentForPdf = (text: string): string => {
  if (!text) return '';
  
  let formattedText = text;
  
  // Extract content from JSON if present
  if (formattedText.includes('{"content"')) {
    try {
      const jsonContent = JSON.parse(formattedText);
      formattedText = jsonContent.content || formattedText;
    } catch (e) {
      console.log('Failed to parse JSON content');
    }
  }
  
  // Handle headings with improved styling
  formattedText = formattedText.replace(/^# (.+)$/gm, '<h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #6b21a8;">$1</h1>');
  formattedText = formattedText.replace(/^## (.+)$/gm, '<h2 style="font-size: 20px; font-weight: bold; margin-top: 24px; margin-bottom: 12px; color: #6b21a8;">$1</h2>');
  formattedText = formattedText.replace(/^### (.+)$/gm, '<h3 style="font-size: 18px; font-weight: bold; margin-top: 20px; margin-bottom: 8px; color: #6b21a8;">$1</h3>');
  
  // Handle bold text with improved styling
  formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: bold;">$1</strong>');
  
  // Handle italic text with improved styling
  formattedText = formattedText.replace(/\*(.+?)\*/g, '<em style="font-style: italic;">$1</em>');
  
  // Handle horizontal rule with a more prominent styling
  formattedText = formattedText.replace(/^---$/gm, '<hr style="border: 1px solid #e5e7eb; margin: 16px 0;" />');
  
  // Fix the $2 separator issue
  formattedText = formattedText.replace(/\$2/g, '<hr style="border: 1px solid #e5e7eb; margin: 16px 0;" />');
  
  // Add spacing between paragraphs
  formattedText = formattedText.replace(/\n\n/g, '</p><p style="margin-bottom: 16px;">');
  
  // Handle "Your Speech Inputs" section with enhanced styling
  if (formattedText.includes('Your Speech Inputs')) {
    formattedText = formattedText.replace(
      /(Your Speech Inputs.*?)---/s, 
      '<div style="background-color: #f5f3ff; padding: 16px; border-radius: 6px; margin-bottom: 24px; border: 1px solid #e9d5ff;">$1</div>'
    );
  }
  
  // Make question-answer pairs in the input section more readable with better colors
  formattedText = formattedText.replace(
    /<strong style="font-weight: bold;">(.+?)<\/strong> (.+?)(?=<\/p>|<strong|$)/g, 
    '<div style="margin-bottom: 8px;"><span style="font-weight: 500; color: #7e22ce;">$1:</span> <span style="color: #1f2937;">$2</span></div>'
  );
  
  // Wrap the content in a paragraph tag with proper spacing
  formattedText = `<p style="margin-bottom: 16px;">${formattedText}</p>`;
  
  // Fix any double wrapping of paragraph tags
  formattedText = formattedText.replace(/<p style="margin-bottom: 16px;"><p style="margin-bottom: 16px;">/g, '<p style="margin-bottom: 16px;">');
  formattedText = formattedText.replace(/<\/p><\/p>/g, '</p>');
  
  return formattedText;
};

/**
 * Extracts content from JSON structure if present
 * @param content Raw content that might be JSON
 * @returns Extracted content string
 */
export const extractContentForExport = (content: string): string => {
  if (content.includes('{"content"')) {
    try {
      const jsonContent = JSON.parse(content);
      return jsonContent.content || content;
    } catch (e) {
      return content;
    }
  }
  return content;
};
