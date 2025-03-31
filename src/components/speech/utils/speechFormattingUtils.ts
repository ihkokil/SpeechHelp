/**
 * Formats speech content for display with HTML formatting
 * @param text Raw speech content text
 * @returns HTML-formatted string
 */
export const formatSpeechContent = (text: string): string => {
  if (!text) return '';
  
  let formattedText = text;
  
  // If the content already contains HTML tags, just return it
  if (formattedText.includes('<h1') || formattedText.includes('<p') || 
      formattedText.includes('<strong') || formattedText.includes('<div')) {
    return formattedText;
  }
  
  // Remove the raw JSON if it appears in the content
  if (formattedText.includes('{"content"')) {
    try {
      const jsonContent = JSON.parse(formattedText);
      formattedText = jsonContent.content || formattedText;
    } catch (e) {
      console.log('Failed to parse JSON content');
    }
  }
  
  // Handle headings with improved styling
  formattedText = formattedText.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4 text-purple-800">$1</h1>');
  formattedText = formattedText.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-purple-700">$1</h2>');
  formattedText = formattedText.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-5 mb-2 text-purple-600">$1</h3>');
  
  // Handle bold text
  formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
  
  // Handle italic text
  formattedText = formattedText.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
  
  // Handle horizontal rule with a more prominent styling
  formattedText = formattedText.replace(/^---$/gm, '<hr class="my-6 border-t-2 border-purple-300" />');
  
  // Add spacing between paragraphs
  formattedText = formattedText.replace(/\n\n/g, '</p><p class="mb-4">');
  
  // Handle "Your Speech Inputs" section
  if (formattedText.includes('Your Speech Inputs')) {
    formattedText = formattedText.replace(
      /(Your Speech Inputs.*?)---/s, 
      '<div class="bg-purple-50 p-4 rounded-md mb-6 border border-purple-200">$1</div>'
    );
  }
  
  // Make question-answer pairs in the input section more readable
  formattedText = formattedText.replace(
    /<strong class="font-bold">(.+?)<\/strong> (.+?)(?=<\/p>|<strong|$)/g, 
    '<div class="mb-2"><span class="font-medium text-purple-700">$1:</span> <span class="text-gray-800">$2</span></div>'
  );
  
  // Wrap the content in a paragraph tag with proper spacing
  formattedText = `<p class="mb-4">${formattedText}</p>`;
  
  // Fix any double wrapping of paragraph tags
  formattedText = formattedText.replace(/<p class="mb-4"><p class="mb-4">/g, '<p class="mb-4">');
  formattedText = formattedText.replace(/<\/p><\/p>/g, '</p>');
  
  return formattedText;
};

/**
 * Extract content from JSON if needed
 * @param content Raw content that might be JSON
 * @returns Extracted content
 */
export const getEditableContent = (content: string): string => {
  if (!content) return '';
  
  try {
    // Check if the content is in JSON format
    if (content.trim().startsWith('{') && content.includes('"content"')) {
      const parsedContent = JSON.parse(content);
      if (parsedContent.content) {
        console.log('Extracted JSON content for editing');
        return parsedContent.content;
      }
    }
  } catch (error) {
    console.error('Error parsing speech content:', error);
  }
  
  // Return the original content if it's not JSON or if parsing fails
  return content;
};

/**
 * Creates a formatted questions and answers section from speech details
 * @param speechDetails Object containing question-answer pairs
 * @returns Formatted markdown string with questions and answers
 */
export const createQuestionsAnswersSection = (speechDetails: Record<string, string>): string => {
  if (!speechDetails || Object.keys(speechDetails).length === 0) {
    return '';
  }

  let output = '# Your Speech Inputs\n\n';
  
  Object.entries(speechDetails).forEach(([question, answer]) => {
    if (answer && answer.trim()) {
      output += `**${question}** ${answer}\n\n`;
    }
  });
  
  output += '---\n\n';
  
  return output;
};

/**
 * Extracts key information from speech details for generating content
 * @param speechDetails Object containing question-answer pairs
 * @returns Object with extracted key information
 */
export const extractKeyInformation = (speechDetails: Record<string, string>) => {
  const name = speechDetails['What is your name?'] || 'Speaker';
  const role = speechDetails['What is your role at this graduation?'] || 
               speechDetails['What is your role?'] || 
               speechDetails['Your role or position?'] || 
               'Speaker';
  const audience = speechDetails['Who are you addressing?'] || 'Everyone';
  const duration = speechDetails['Desired length of the speech?'] || '5 minutes';
  const tone = speechDetails['Tone of the speech?'] || 'Formal';
  const theme = speechDetails['Key message or theme?'] || '';
  const story = speechDetails['Share a personal story or experience.'] || '';
  const quote = speechDetails['Include a famous quote or saying?'] || '';
  const achievements = speechDetails['Specific achievements or milestones to mention?'] || '';
  const callToAction = speechDetails['Is there a call to action or advice?'] || '';
  const closing = speechDetails['Closing remarks or statement?'] || '';
  
  return {
    name,
    role,
    audience,
    duration,
    tone,
    theme,
    story,
    quote,
    achievements,
    callToAction,
    closing
  };
};
