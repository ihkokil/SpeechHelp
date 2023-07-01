
import { SpeechDetails } from '../hooks/useSpeechLabState';
import { parseDurationToMinutes } from './durationUtils';
import { enhanceSpeechForDuration } from './speechEnhancer';
import { createQuestionsAnswersSection } from './speechFormattingUtils';
import { createFormattedSpeech } from './speechContentCreator';
import { generateAIPrompt } from './aiPromptGenerator';

/**
 * Generates a speech based on questionnaire answers
 */
export const generateSpeechFromDetails = (speechTitle: string, speechDetails: SpeechDetails = {}, speechType: string = ''): string => {
  const detailsArray = Object.entries(speechDetails || {});
  
  if (detailsArray.length === 0) {
    return "This is your generated speech. Unfortunately, we couldn't find your questionnaire details. You can edit this placeholder text to create your own speech.";
  }
  
  // Generate the optimized AI prompt that would be sent to the third-party AI
  const aiPrompt = generateAIPrompt(speechTitle, speechType, speechDetails);
  
  // In a real implementation, this is where you would send the prompt to the third-party AI
  // and receive the generated speech. For now, we'll continue with the existing logic.
  console.log('Generated AI Prompt for third-party service:', aiPrompt);
  
  // Create the questions and answers section
  const questionsAnswersSection = createQuestionsAnswersSection(speechDetails);
  
  // Create the formatted speech
  const formattedSpeech = createFormattedSpeech(speechTitle, speechDetails);
  
  // Combine the questions/answers section with the formatted speech
  let completeSpeech = questionsAnswersSection + formattedSpeech;
  
  // Process duration if specified - always ensure we enhance the speech for better quality
  const durationInfo = detailsArray.find(([question]) => 
    question.toLowerCase().includes('length') || 
    question.toLowerCase().includes('duration') ||
    question.toLowerCase().includes('time')
  );
  
  if (durationInfo && durationInfo[1]) {
    const targetDuration = parseDurationToMinutes(durationInfo[1]);
    completeSpeech = enhanceSpeechForDuration(completeSpeech, targetDuration);
  } else {
    // Even if no specific duration is mentioned, apply some enhancement for consistency
    completeSpeech = enhanceSpeechForDuration(completeSpeech, 5); // Default to a 5-minute speech enhancement
  }
  
  return completeSpeech;
};
