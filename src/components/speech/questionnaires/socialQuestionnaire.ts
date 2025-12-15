
import { QuestionItem } from './types';
import { 
  introductionQuestion,
  emotionalImpactQuestion,
  humorLevelQuestion,
  speechStructureQuestion,
  languageStyleQuestion,
  culturalElementsQuestion,
  culturalDetailsQuestion
} from './introductionQuestion';

export const socialQuestionnaire: QuestionItem[] = [
  introductionQuestion,
  { 
    question: "What is your name?", 
    type: "text", 
    placeholder: "E.g., Lisa Johnson",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is your relation to this event?", 
    type: "text", 
    placeholder: "E.g., Host, Guest of Honor, Friend",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is the type of social gathering?", 
    type: "text", 
    placeholder: "E.g., Dinner Party, Charity Event, Holiday Celebration" 
  },
  { 
    question: "Who is the audience?", 
    type: "text", 
    placeholder: "E.g., Dinner Guests, Friends at a Gathering" 
  },
  { 
    question: "What is the occasion or reason for the gathering?", 
    type: "textarea", 
    placeholder: "Describe why people are coming together..." 
  },
  { 
    question: "Speech type?", 
    type: "radio", 
    options: ["Toast", "Roast", "Welcome Address", "Thank You Speech", "Casual Remarks"] 
  },
  { 
    question: "Desired length of the speech (in minutes)?", 
    type: "text", 
    placeholder: "E.g., 2 minutes"
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Humorous", "Lighthearted", "Warm", "Appreciative", "Playful"] 
  },
  emotionalImpactQuestion,
  humorLevelQuestion,
  speechStructureQuestion,
  languageStyleQuestion,
  { 
    question: "Share a funny or memorable story.", 
    type: "textarea", 
    placeholder: "Describe an amusing or relevant moment..." 
  },
  { 
    question: "What connection do you want to highlight with the guests?", 
    type: "textarea", 
    placeholder: "Describe relationships or shared experiences..." 
  },
  { 
    question: "Any specific anecdotes or jokes to include?", 
    type: "textarea", 
    placeholder: "Share any entertaining moments..." 
  },
  culturalElementsQuestion,
  culturalDetailsQuestion,
  { 
    question: "Is there a message or theme?", 
    type: "textarea", 
    placeholder: "Any central point to convey?" 
  },
  { 
    question: "Any specific people you want to acknowledge?", 
    type: "textarea", 
    placeholder: "Names of people to thank or recognize..." 
  },
  { 
    question: "Closing remarks or toast?", 
    type: "textarea", 
    placeholder: "How would you like to conclude?" 
  }
];
