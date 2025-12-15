
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

export const entertainingQuestionnaire: QuestionItem[] = [
  introductionQuestion,
  { 
    question: "What is your name?", 
    type: "text", 
    placeholder: "E.g., Sam Brown",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is your role at this event?", 
    type: "text", 
    placeholder: "E.g., Guest Speaker, Master of Ceremonies",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What type of event is this?", 
    type: "text", 
    placeholder: "E.g., Holiday Party, Awards Dinner, Casual Gathering" 
  },
  { 
    question: "Who is the audience?", 
    type: "text", 
    placeholder: "E.g., Party Guests, Event Attendees" 
  },
  { 
    question: "What is the audience's sense of humor?", 
    type: "radio", 
    options: ["Sophisticated", "Broad/General", "Playful", "Self-deprecating", "Quirky"] 
  },
  { 
    question: "Desired length of the speech (in minutes)?", 
    type: "text", 
    placeholder: "E.g., 5 minutes"
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Fun", "Amusing", "Witty", "Lighthearted", "Engaging"] 
  },
  emotionalImpactQuestion,
  humorLevelQuestion,
  speechStructureQuestion,
  languageStyleQuestion,
  { 
    question: "Share a funny or engaging story.", 
    type: "textarea", 
    placeholder: "Describe an entertaining experience..." 
  },
  { 
    question: "Any relatable situations to include?", 
    type: "textarea", 
    placeholder: "Common experiences the audience will recognize..." 
  },
  { 
    question: "Any specific jokes or anecdotes to include?", 
    type: "textarea", 
    placeholder: "Share any humorous content..." 
  },
  culturalElementsQuestion,
  culturalDetailsQuestion,
  { 
    question: "Are there any inside jokes relevant to this group?", 
    type: "textarea", 
    placeholder: "Share any group-specific humor..." 
  },
  { 
    question: "Is there a theme or message?", 
    type: "textarea", 
    placeholder: "Any central point amid the entertainment?" 
  },
  { 
    question: "Closing remarks or humorous ending?", 
    type: "textarea", 
    placeholder: "How would you like to conclude?" 
  }
];
