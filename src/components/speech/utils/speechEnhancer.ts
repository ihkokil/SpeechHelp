
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
  console.log(`Enhancing speech: current duration ${currentDuration.toFixed(1)} minutes, target ${targetDuration} minutes`);
  
  // If the target duration is significantly longer (like 1 hour = 60 minutes), we need substantial expansion
  if (targetDuration >= 30) {
    return enhanceForLongSpeech(speech, targetDuration);
  }
  
  // For shorter speeches, use the existing enhancement logic
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

/**
 * Enhances speech content for longer durations (30+ minutes)
 */
function enhanceForLongSpeech(speech: string, targetDuration: number): string {
  const targetWords = Math.round(targetDuration * 130); // 130 words per minute
  const currentWords = speech.trim().split(/\s+/).length;
  
  console.log(`Long speech enhancement: current ${currentWords} words, target ${targetWords} words`);
  
  if (currentWords >= targetWords * 0.8) {
    return speech; // Already close to target length
  }
  
  // Break the speech into expandable sections
  const sections = speech.split(/\n\n+/);
  let enhancedSpeech = '';
  
  // Calculate how much to expand each section
  const expansionFactor = targetWords / currentWords;
  const significantExpansion = expansionFactor > 2;
  
  sections.forEach((section, index) => {
    enhancedSpeech += section + '\n\n';
    
    // Add substantial content between sections for long speeches
    if (significantExpansion && index < sections.length - 1) {
      
      // Add storytelling elements
      if (index === 0) {
        enhancedSpeech += `Let me take you on a journey through this important topic. When we consider the significance of what we're discussing today, we must understand not just the immediate implications, but the broader context that shapes our understanding.\n\n`;
        
        enhancedSpeech += `Throughout history, moments like these have served as pivotal points that define our collective experience. The lessons we learn and the insights we gain become the foundation upon which we build our future endeavors.\n\n`;
      }
      
      // Add detailed examples and elaboration
      if (index === Math.floor(sections.length / 3)) {
        enhancedSpeech += `Allow me to share some specific examples that illustrate these important points. When we examine real-world applications and case studies, we begin to see patterns that help us understand the deeper meaning behind our discussion.\n\n`;
        
        enhancedSpeech += `Consider the various ways these principles manifest in our daily lives. From personal relationships to professional endeavors, from community involvement to individual growth, these concepts touch every aspect of our human experience.\n\n`;
        
        enhancedSpeech += `The research and evidence supporting these ideas spans decades of careful study and observation. Experts in the field have consistently found that when these principles are applied thoughtfully and consistently, the results speak for themselves.\n\n`;
      }
      
      // Add philosophical reflection
      if (index === Math.floor(sections.length * 2 / 3)) {
        enhancedSpeech += `As we delve deeper into this subject, it's worth pausing to reflect on the philosophical implications of what we're discussing. The questions raised go beyond simple practical applications and touch on fundamental aspects of human nature and social dynamics.\n\n`;
        
        enhancedSpeech += `What does this mean for us as individuals? How do these insights shape our understanding of our responsibilities to ourselves and to others? These are not merely academic questions, but practical considerations that influence how we navigate our daily lives.\n\n`;
        
        enhancedSpeech += `The interconnected nature of these concepts reveals itself when we step back and observe the bigger picture. Each element builds upon the others, creating a comprehensive framework for understanding and action.\n\n`;
      }
      
      // Add personal connection and emotional resonance
      if (index > sections.length / 2) {
        enhancedSpeech += `I want you to think about your own experiences with these concepts. How have they played out in your life? What successes have you witnessed? What challenges have you faced? Your personal journey with these ideas is unique and valuable.\n\n`;
        
        enhancedSpeech += `The power of shared understanding cannot be overstated. When we come together to explore these important topics, we create opportunities for growth, learning, and meaningful connection that extend far beyond this moment.\n\n`;
      }
    }
  });
  
  // Add a substantial wrap-up section for very long speeches
  if (targetDuration >= 45) {
    enhancedSpeech += `\nAs we approach the conclusion of our time together, I want to emphasize the lasting impact that understanding and applying these principles can have. The journey we've taken today through these important concepts is just the beginning of a longer process of growth and development.\n\n`;
    
    enhancedSpeech += `The responsibility now lies with each of us to take these insights and transform them into meaningful action. Change begins with understanding, but it is sustained through consistent application and continuous learning.\n\n`;
    
    enhancedSpeech += `Remember that progress is not always linear, and setbacks are not failures but opportunities for deeper learning. The path forward requires patience, persistence, and a willingness to adapt as we encounter new challenges and opportunities.\n\n`;
  }
  
  const finalWordCount = enhancedSpeech.trim().split(/\s+/).length;
  console.log(`Final enhanced speech: ${finalWordCount} words, estimated ${(finalWordCount / 130).toFixed(1)} minutes`);
  
  return enhancedSpeech;
}
