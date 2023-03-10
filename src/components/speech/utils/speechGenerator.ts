
import { SpeechDetails } from '../hooks/useSpeechLabState';

/**
 * Generates a speech based on questionnaire answers
 */
export const generateSpeechFromDetails = (speechTitle: string, speechDetails: SpeechDetails = {}): string => {
  const detailsArray = Object.entries(speechDetails || {});
  
  if (detailsArray.length === 0) {
    return "This is your generated speech. Unfortunately, we couldn't find your questionnaire details. You can edit this placeholder text to create your own speech.";
  }
  
  let speech = `# ${speechTitle}\n\n`;
  
  const roleInfo = detailsArray.find(([question]) => 
    question.toLowerCase().includes('relation') || 
    question.toLowerCase().includes('role') || 
    question.toLowerCase().includes('who are you')
  );
  
  const nameInfo = detailsArray.find(([question]) => 
    question.toLowerCase().includes('name')
  );
  
  if (roleInfo || nameInfo) {
    speech += "## Introduction\n\n";
    
    if (nameInfo) {
      speech += `Good evening everyone, my name is ${nameInfo[1]}. `;
    } else {
      speech += "Good evening everyone. ";
    }
    
    if (roleInfo) {
      speech += `As the ${roleInfo[1]}, it's my honor to speak today.\n\n`;
    } else {
      speech += "It's my honor to speak today.\n\n";
    }
  } else {
    speech += "## Introduction\n\nGood evening everyone. It's my honor to speak today.\n\n";
  }
  
  speech += "## Main Content\n\n";
  
  const storyInfo = detailsArray.find(([question]) => 
    question.toLowerCase().includes('story') || 
    question.toLowerCase().includes('memory') || 
    question.toLowerCase().includes('experience')
  );
  
  if (storyInfo) {
    speech += `I would like to share a special memory: ${storyInfo[1]}\n\n`;
  }
  
  const qualitiesInfo = detailsArray.find(([question]) => 
    question.toLowerCase().includes('qualities') || 
    question.toLowerCase().includes('admire') || 
    question.toLowerCase().includes('achievement')
  );
  
  if (qualitiesInfo) {
    speech += `What stands out most is: ${qualitiesInfo[1]}\n\n`;
  }
  
  const messageInfo = detailsArray.find(([question]) => 
    question.toLowerCase().includes('message') || 
    question.toLowerCase().includes('theme') || 
    question.toLowerCase().includes('takeaway')
  );
  
  if (messageInfo) {
    speech += `The main message I want to convey today is: ${messageInfo[1]}\n\n`;
  }
  
  speech += "## Conclusion\n\n";
  
  const closingInfo = detailsArray.find(([question]) => 
    question.toLowerCase().includes('closing') || 
    question.toLowerCase().includes('toast') || 
    question.toLowerCase().includes('conclusion')
  );
  
  if (closingInfo) {
    speech += `${closingInfo[1]}\n\n`;
  } else {
    speech += "Thank you all for your attention and for being here today. It means a great deal to me.\n\n";
  }
  
  speech += "---\n\nThis speech was automatically generated based on your questionnaire answers. Please edit it to better fit your style and needs.";
  
  return speech;
};
