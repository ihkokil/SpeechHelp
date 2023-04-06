
import { SpeechDetails } from '../hooks/useSpeechLabState';

/**
 * Estimates the speech duration based on word count (average speaking rate)
 * @param text Speech text content
 * @returns Estimated duration in minutes
 */
const estimateSpeechDuration = (text: string): number => {
  const words = text.trim().split(/\s+/).length;
  // Average speaking rate is about 130 words per minute
  return words / 130;
};

/**
 * Enhances the speech content to match the requested duration
 * @param speech Current speech content
 * @param targetDuration Target duration in minutes (parsed from user input)
 * @returns Enhanced speech content
 */
const enhanceSpeechForDuration = (speech: string, targetDuration: number): string => {
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

/**
 * Parses the duration from user input to minutes
 * @param durationInput User input for duration (e.g., "5 minutes")
 * @returns Duration in minutes (defaults to 5 if parsing fails)
 */
const parseDurationToMinutes = (durationInput: string): number => {
  if (!durationInput) return 5; // Default duration
  
  // Extract numbers from the input
  const match = durationInput.match(/\d+/);
  if (match) {
    return parseInt(match[0], 10);
  }
  
  return 5; // Default to 5 minutes if parsing fails
};

/**
 * Generates a speech based on questionnaire answers
 */
export const generateSpeechFromDetails = (speechTitle: string, speechDetails: SpeechDetails = {}): string => {
  const detailsArray = Object.entries(speechDetails || {});
  
  if (detailsArray.length === 0) {
    return "This is your generated speech. Unfortunately, we couldn't find your questionnaire details. You can edit this placeholder text to create your own speech.";
  }
  
  // Create the questions and answers section
  let questionsAnswersSection = "# Your Speech Inputs\n\n";
  
  detailsArray.forEach(([question, answer]) => {
    // Skip the intro question about being introduced
    if (question.includes("Will you be introduced")) {
      return;
    }
    
    questionsAnswersSection += `**${question}** ${answer}\n\n`;
  });
  
  questionsAnswersSection += "---\n\n";
  
  // Start the formatted speech
  let formattedSpeech = `# ${speechTitle}\n\n`;
  
  // Extract key information from the questionnaire
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
  
  // Introduction section
  formattedSpeech += "## Introduction\n\n";
  
  if (nameInfo) {
    formattedSpeech += `Good evening everyone, my name is ${nameInfo[1]}. `;
  } else {
    formattedSpeech += "Good evening everyone. ";
  }
  
  if (roleInfo) {
    formattedSpeech += `As the ${roleInfo[1]}, it's my honor to speak today. `;
  } else {
    formattedSpeech += "It's my honor to speak today. ";
  }
  
  if (audienceInfo) {
    formattedSpeech += `I'm delighted to address ${audienceInfo[1]} on this special occasion. `;
  }
  
  if (toneInfo) {
    // Add a tone-appropriate opening line
    const tone = toneInfo[1].toLowerCase();
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
      question === (nameInfo?.[0] || '') ||
      question === (roleInfo?.[0] || '') ||
      question === (audienceInfo?.[0] || '') ||
      question === (durationInfo?.[0] || '') ||
      question === (toneInfo?.[0] || '')
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
  
  // Combine the questions/answers section with the formatted speech
  const completeSpeech = questionsAnswersSection + formattedSpeech;
  
  // Process duration if specified
  if (durationInfo && durationInfo[1]) {
    const targetDuration = parseDurationToMinutes(durationInfo[1]);
    return enhanceSpeechForDuration(completeSpeech, targetDuration);
  }
  
  return completeSpeech;
};
