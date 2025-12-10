
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
export const enhanceSpeechForDuration = (speechText: string, targetMinutes: number): string => {
  const currentDuration = estimateSpeechDuration(speechText);
  
  console.log(`Current speech duration: ${currentDuration.toFixed(1)} minutes, target: ${targetMinutes} minutes`);
  
  // If the speech is already close to the target duration (within 15%), return as is
  const tolerance = Math.max(targetMinutes * 0.15, 0.5); // At least 0.5 minute tolerance
  if (Math.abs(currentDuration - targetMinutes) <= tolerance) {
    console.log('Speech duration is already within acceptable range');
    return speechText;
  }
  
  // If target is 30 minutes or more, use the specialized long speech enhancement
  if (targetMinutes >= 30) {
    return enhanceForLongSpeech(speechText, targetMinutes);
  }
  
  // Calculate how much content we need to add or remove
  const durationDifference = targetMinutes - currentDuration;
  const wordsToAdd = Math.round(durationDifference * 130); // 130 words per minute
  
  console.log(`Need to ${durationDifference > 0 ? 'add' : 'remove'} approximately ${Math.abs(wordsToAdd)} words`);
  
  if (durationDifference > 0) {
    // Need to expand the speech
    return expandSpeech(speechText, wordsToAdd, targetMinutes);
  } else {
    // Need to trim the speech
    return trimSpeech(speechText, Math.abs(wordsToAdd));
  }
};

const expandSpeech = (speechText: string, wordsToAdd: number, targetMinutes: number): string => {
  const sections = speechText.split('\n\n').filter(s => s.trim());
  const wordsPerSection = Math.ceil(wordsToAdd / sections.length);
  
  const enhancedSections = sections.map((section, index) => {
    if (section.trim() === '') return section;
    
    let enhanced = section;
    
    // Add transitional phrases and elaborations
    if (index > 0 && index < sections.length - 1) {
      const transitions = [
        "Now, let me elaborate on this important point...",
        "This brings me to a crucial consideration...",
        "Building on what I just shared with you...",
        "Let me take a moment to expand on this idea...",
        "This is particularly significant because..."
      ];
      const randomTransition = transitions[Math.floor(Math.random() * transitions.length)];
      enhanced = `${randomTransition}\n\n${enhanced}`;
    }
    
    // Add detailed examples for key points
    if (section.includes(':') || section.includes('important') || section.includes('key')) {
      enhanced += "\n\nLet me give you a specific example to illustrate this point. This demonstrates exactly what I mean and why it matters so much in this context.";
    }
    
    // Add pause instructions for longer speeches
    if (targetMinutes >= 10 && index === Math.floor(sections.length / 2)) {
      enhanced += "\n\n[Pause for a moment to let this sink in]";
    }
    
    return enhanced;
  });
  
  return enhancedSections.join('\n\n');
};

const trimSpeech = (speechText: string, wordsToRemove: number): string => {
  // For trimming, remove redundant phrases and shorten examples
  let trimmed = speechText;
  
  // Remove common filler phrases
  const fillerPhrases = [
    'Let me tell you,',
    'As I mentioned before,',
    'It\'s important to note that',
    'You might be wondering',
    'In other words,'
  ];
  
  fillerPhrases.forEach(phrase => {
    const regex = new RegExp(phrase + '\\s*', 'gi');
    trimmed = trimmed.replace(regex, '');
  });
  
  // Shorten overly long sentences by removing unnecessary adjectives
  trimmed = trimmed.replace(/\b(very|extremely|incredibly|absolutely|completely)\s+/gi, '');
  
  return trimmed;
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
