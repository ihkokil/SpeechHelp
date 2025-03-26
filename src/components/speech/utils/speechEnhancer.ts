
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
  
  // If we're already close to the target duration (within 0.5 minutes), no adjustment needed
  if (Math.abs(currentDuration - targetDuration) < 0.5) {
    return speech;
  }
  
  // Need to add more content
  if (currentDuration < targetDuration) {
    const sections = speech.split('\n\n');
    let enhancedSpeech = '';
    
    // Identify where we can add more content
    const introIndex = sections.findIndex(s => s.includes('## Introduction'));
    const mainIndex = sections.findIndex(s => s.includes('## Main Content'));
    const conclusionIndex = sections.findIndex(s => s.includes('## Conclusion'));
    
    // Add content to each section proportionally
    sections.forEach((section, index) => {
      enhancedSpeech += section + '\n\n';
      
      // Add elaboration after main content sections
      if (index === mainIndex + 1) {
        enhancedSpeech += "Let me elaborate further on this important point. The experiences we share and the moments we create together form the foundation of our relationships. These connections we build with one another enrich our lives in countless ways, providing support, joy, and meaning throughout our journey.\n\n";
      }
      
      // Add transition before conclusion
      if (index === conclusionIndex - 1) {
        enhancedSpeech += "As I reflect on everything I've shared today, I'm reminded of how special this occasion truly is. The memories we make here will stay with us for years to come.\n\n";
      }
    });
    
    return enhancedSpeech;
  }
  
  // Need to trim content (rarely needed, but included for completeness)
  return speech;
};
