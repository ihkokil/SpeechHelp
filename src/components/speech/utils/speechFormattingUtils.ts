
/**
 * Utilities for formatting speech content
 */
import { SpeechDetails } from '../hooks/useSpeechLabState';

/**
 * Create the questions and answers section of the speech
 * @param speechDetails User's answers to questionnaire
 * @returns Formatted questions/answers section
 */
export const createQuestionsAnswersSection = (
  speechDetails: SpeechDetails = {}
): string => {
  const detailsArray = Object.entries(speechDetails || {});
  
  if (detailsArray.length === 0) {
    return "# Your Speech Inputs\n\n";
  }
  
  let questionsAnswersSection = "# Your Speech Inputs\n\n";
  
  detailsArray.forEach(([question, answer]) => {
    // Skip the intro question about being introduced
    if (question.includes("Will you be introduced")) {
      return;
    }
    
    questionsAnswersSection += `**${question}** ${answer}\n\n`;
  });
  
  questionsAnswersSection += "---\n\n";
  
  return questionsAnswersSection;
};

/**
 * Extract key information from speech details
 * @param speechDetails User's answers to questionnaire
 * @returns Object containing extracted key information
 */
export const extractKeyInformation = (speechDetails: SpeechDetails = {}) => {
  const detailsArray = Object.entries(speechDetails || {});
  
  const roleInfo = detailsArray.find(([question]) => 
    question.toLowerCase().includes('relation') || 
    question.toLowerCase().includes('role') || 
    question.toLowerCase().includes('who are you')
  );
  
  const nameInfo = detailsArray.find(([question]) => 
    question.toLowerCase().includes('name')
  );
  
  const audienceInfo = detailsArray.find(([question]) => 
    question.toLowerCase().includes('audience') ||
    question.toLowerCase().includes('guests') ||
    question.toLowerCase().includes('addressing')
  );
  
  const durationInfo = detailsArray.find(([question]) => 
    question.toLowerCase().includes('length') || 
    question.toLowerCase().includes('duration') ||
    question.toLowerCase().includes('time')
  );
  
  const toneInfo = detailsArray.find(([question]) => 
    question.toLowerCase().includes('tone')
  );
  
  return {
    roleInfo,
    nameInfo,
    audienceInfo,
    durationInfo,
    toneInfo
  };
};
