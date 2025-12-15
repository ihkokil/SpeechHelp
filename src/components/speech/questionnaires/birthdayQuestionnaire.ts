
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

export const birthdayQuestionnaire: QuestionItem[] = [
  introductionQuestion,
  { 
    question: "What is your name?", 
    type: "text", 
    placeholder: "E.g., Sarah Smith",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is your relationship to the celebrant?", 
    type: "text", 
    placeholder: "E.g., Sister, Friend, Colleague",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is the full name of the person celebrating?", 
    type: "text", 
    placeholder: "E.g., David Johnson" 
  },
  { 
    question: "Which birthday or anniversary is being celebrated?", 
    type: "text", 
    placeholder: "E.g., 40th Birthday, 25th Anniversary" 
  },
  { 
    question: "How long have you known the celebrant?", 
    type: "text", 
    placeholder: "E.g., 15 years, Entire life"
  },
  { 
    question: "Speech length preference (in minutes)?", 
    type: "text", 
    placeholder: "E.g., 2-3 minutes" 
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Lighthearted", "Heartfelt", "Humorous", "Nostalgic", "Celebratory"] 
  },
  emotionalImpactQuestion,
  humorLevelQuestion,
  speechStructureQuestion,
  languageStyleQuestion,
  { 
    question: "Share a memorable moment with the celebrant.", 
    type: "textarea", 
    placeholder: "Describe a meaningful experience..." 
  },
  { 
    question: "What milestone or achievement would you like to highlight?", 
    type: "textarea", 
    placeholder: "Any significant life events to celebrate..." 
  },
  { 
    question: "Qualities or achievements to highlight?", 
    type: "textarea", 
    placeholder: "What makes this person special?" 
  },
  culturalElementsQuestion,
  culturalDetailsQuestion,
  { 
    question: "Include a humorous or sentimental story?", 
    type: "textarea", 
    placeholder: "Share a specific story or memory..." 
  },
  { 
    question: "Any specific wishes or toast to include?", 
    type: "textarea", 
    placeholder: "What wishes do you have for them?" 
  },
  { 
    question: "Anything to avoid mentioning?", 
    type: "textarea", 
    placeholder: "Any sensitive topics or issues?" 
  },
  {
    question: "What hopes do you have for their future?",
    type: "textarea",
    placeholder: "Share your wishes for their coming year or future..."
  }
];
