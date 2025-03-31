
/**
 * Utilities for creating speech content
 */
import { SpeechDetails } from '../hooks/useSpeechLabState';
import { extractKeyInformation } from './speechFormattingUtils';

/**
 * Creates the formatted speech content from speech details
 * @param speechTitle Title of the speech
 * @param speechDetails User's answers to questionnaire
 * @returns Formatted speech content
 */
export const createFormattedSpeech = (speechTitle: string, speechDetails: SpeechDetails = {}): string => {
  const detailsArray = Object.entries(speechDetails || {});
  
  // Start the formatted speech
  let formattedSpeech = `# ${speechTitle}\n\n`;
  
  // Extract key information from the questionnaire
  const keyInfo = extractKeyInformation(speechDetails);
  
  // Introduction section
  formattedSpeech += "## Introduction\n\n";
  
  if (keyInfo.name) {
    formattedSpeech += `Good evening everyone, my name is ${keyInfo.name}. `;
  } else {
    formattedSpeech += "Good evening everyone. ";
  }
  
  if (keyInfo.role) {
    formattedSpeech += `As the ${keyInfo.role}, it's my honor to speak today. `;
  } else {
    formattedSpeech += "It's my honor to speak today. ";
  }
  
  if (keyInfo.audience) {
    formattedSpeech += `I'm delighted to address ${keyInfo.audience} on this special occasion. `;
  }
  
  if (keyInfo.tone) {
    // Add a tone-appropriate opening line
    const tone = keyInfo.tone.toLowerCase();
    if (tone.includes('humor')) {
      formattedSpeech += "I promise to keep this light and hopefully entertaining enough that you won't be checking your watches every few minutes. ";
    } else if (tone.includes('formal') || tone.includes('respect')) {
      formattedSpeech += "I would like to extend my sincerest gratitude for the opportunity to share these words with you today. ";
    } else if (tone.includes('warm') || tone.includes('heartfelt')) {
      formattedSpeech += "My heart is full as I stand before you all today, ready to share some heartfelt thoughts. ";
    }
  }
  
  formattedSpeech += "\n\n";
  
  // Main Content section
  formattedSpeech += "## Main Content\n\n";
  
  // Include ALL questionnaire responses in the speech body
  detailsArray.forEach(([question, answer]) => {
    // Skip intro question and already processed items
    if (
      question.includes("Will you be introduced") ||
      (question === "What is your name?" && keyInfo.name === answer) ||
      (question.includes("What is your role") && keyInfo.role === answer) ||
      (question === "Who are you addressing?" && keyInfo.audience === answer) ||
      (question === "Tone of the speech?" && keyInfo.tone === answer)
    ) {
      return;
    }
    
    // Format the question as a theme and incorporate the answer
    if (answer && answer.trim()) {
      // Extract theme from question (remove question marks, etc.)
      const theme = question
        .replace(/\?/g, '')
        .replace(/any /i, '')
        .replace(/is there /i, '')
        .replace(/include /i, '')
        .replace(/specific /i, '')
        .toLowerCase();
      
      // Special handling for stories or memories
      if (
        question.toLowerCase().includes('story') || 
        question.toLowerCase().includes('memory') || 
        question.toLowerCase().includes('experience')
      ) {
        formattedSpeech += `I'd like to share a special memory: ${answer}\n\n`;
      }
      // Special handling for qualities or achievements
      else if (
        question.toLowerCase().includes('qualities') || 
        question.toLowerCase().includes('admire') || 
        question.toLowerCase().includes('achievement')
      ) {
        formattedSpeech += `What stands out most is: ${answer}\n\n`;
      }
      // Special handling for messages or themes
      else if (
        question.toLowerCase().includes('message') || 
        question.toLowerCase().includes('theme') || 
        question.toLowerCase().includes('takeaway')
      ) {
        formattedSpeech += `The main message I want to convey today is: ${answer}\n\n`;
      }
      // General handling for other questions
      else {
        formattedSpeech += `Regarding ${theme}: ${answer}\n\n`;
      }
    }
  });
  
  // Conclusion section
  formattedSpeech += "## Conclusion\n\n";
  
  const closingInfo = detailsArray.find(([question]) => 
    question.toLowerCase().includes('closing') || 
    question.toLowerCase().includes('toast') || 
    question.toLowerCase().includes('conclusion')
  );
  
  if (closingInfo) {
    formattedSpeech += `${closingInfo[1]}\n\n`;
  } else {
    formattedSpeech += "Thank you all for your attention and for being here today. It means a great deal to me.\n\n";
  }
  
  return formattedSpeech;
};
