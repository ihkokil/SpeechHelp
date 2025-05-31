
/**
 * Utilities for enhancing speech content
 */
import { estimateSpeechDuration } from './durationUtils';

/**
 * Enhances the speech content to match the requested duration
 * @param speech Current speech content
 * @param targetDuration Target duration in minutes (parsed from user input)
 * @returns Enhanced speech content
 */
export const enhanceSpeechForDuration = (speech: string, targetDuration: number): string => {
  const currentDuration = estimateSpeechDuration(speech);
  
  // Always enhance the speech with better transitions and embellishments
  const sections = speech.split('\n\n');
  let enhancedSpeech = '';
  
  // Identify important sections
  const introIndex = sections.findIndex(s => s.includes('## Introduction'));
  const mainIndex = sections.findIndex(s => s.includes('## Main Content'));
  const conclusionIndex = sections.findIndex(s => s.includes('## Conclusion'));
  
  // Add content to each section with better transitions
  sections.forEach((section, index) => {
    enhancedSpeech += section + '\n\n';
    
    // Always add elaboration after introduction
    if (index === introIndex && introIndex >= 0) {
      enhancedSpeech += "As I stand before you today, I'm reminded of the significance of this moment and the privilege it is to share these words with you. The connections we forge and the memories we create together are what truly matter in life.\n\n";
    }
    
    // Add elaboration after main content sections if needed to reach target duration
    if (index === mainIndex + 1 && mainIndex >= 0) {
      enhancedSpeech += "Let me elaborate further on this important point. The experiences we share and the moments we create together form the foundation of our relationships. These connections we build with one another enrich our lives in countless ways, providing support, joy, and meaning throughout our journey.\n\n";
    }
    
    // Add transition before conclusion
    if (index === conclusionIndex - 1 && conclusionIndex >= 0) {
      enhancedSpeech += "As I reflect on everything I've shared today, I'm reminded of how special this occasion truly is. The memories we make here will stay with us for years to come.\n\n";
    }
  });
  
  // If we still need more content to reach the target duration
  if (currentDuration < targetDuration && Math.abs(currentDuration - targetDuration) >= 0.5) {
    // Add additional content near the conclusion for emotional impact
    if (conclusionIndex >= 0) {
      const insertPosition = enhancedSpeech.lastIndexOf('## Conclusion');
      if (insertPosition !== -1) {
        const additionalContent = "\nBefore I conclude, I want to take a moment to express my sincere gratitude for being part of this occasion. It's moments like these that remind us of what truly matters in life – the connections we build, the love we share, and the memories we create together.\n\n";
        enhancedSpeech = enhancedSpeech.slice(0, insertPosition) + additionalContent + enhancedSpeech.slice(insertPosition);
      }
    }
  }
  
  return enhancedSpeech;
};
