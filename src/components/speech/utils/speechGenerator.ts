
import { SpeechDetails } from '../hooks/useSpeechLabState';
import { parseDurationToMinutes } from './durationUtils';
import { enhanceSpeechForDuration } from './speechEnhancer';
import { createQuestionsAnswersSection } from './speechFormattingUtils';
import { createFormattedSpeech } from './speechContentCreator';

/**
 * Generates a speech based on questionnaire answers
 */
export const generateSpeechFromDetails = (speechTitle: string, speechDetails: SpeechDetails = {}): string => {
  const detailsArray = Object.entries(speechDetails || {});
  
  if (detailsArray.length === 0) {
    return "This is your generated speech. Unfortunately, we couldn't find your questionnaire details. You can edit this placeholder text to create your own speech.";
  }
  
  // Create the questions and answers section
  const questionsAnswersSection = createQuestionsAnswersSection(speechDetails);
  
  // Create the formatted speech
  const formattedSpeech = createFormattedSpeech(speechTitle, speechDetails);
  
  // Combine the questions/answers section with the formatted speech
  const completeSpeech = questionsAnswersSection + formattedSpeech;
  
  // Process duration if specified
  const durationInfo = detailsArray.find(([question]) => 
    question.toLowerCase().includes('length') || 
    question.toLowerCase().includes('duration') ||
    question.toLowerCase().includes('time')
  );
  
  if (durationInfo && durationInfo[1]) {
    const targetDuration = parseDurationToMinutes(durationInfo[1]);
    return enhanceSpeechForDuration(completeSpeech, targetDuration);
  }
  
  return completeSpeech;
};
