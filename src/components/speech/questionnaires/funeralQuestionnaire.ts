
import { QuestionItem } from './types';
import { 
  introductionQuestion,
  emotionalImpactQuestion,
  speechStructureQuestion,
  languageStyleQuestion,
  culturalElementsQuestion,
  culturalDetailsQuestion
} from './introductionQuestion';

export const funeralQuestionnaire: QuestionItem[] = [
  introductionQuestion,
  { 
    question: "What is your name?", 
    type: "text", 
    placeholder: "E.g., James Wilson",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is your relationship to the deceased?", 
    type: "text", 
    placeholder: "E.g., Nephew, Colleague, Friend",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is the full name of the deceased?", 
    type: "text", 
    placeholder: "E.g., Robert James Smith" 
  },
  { 
    question: "How long did you know the deceased?", 
    type: "text", 
    placeholder: "E.g., 30 years, Since childhood" 
  },
  { 
    question: "What was their occupation or life's work?", 
    type: "text", 
    placeholder: "E.g., Teacher, Engineer, Parent" 
  },
  { 
    question: "Desired length of the speech (in minutes)?", 
    type: "text", 
    placeholder: "E.g., 5 minutes"
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Reflective", "Respectful", "Celebratory of Life", "Solemn", "Hopeful"] 
  },
  emotionalImpactQuestion,
  speechStructureQuestion,
  languageStyleQuestion,
  { 
    question: "Share a cherished memory or story.", 
    type: "textarea", 
    placeholder: "Describe a meaningful experience..." 
  },
  { 
    question: "What legacy did they leave behind?", 
    type: "textarea", 
    placeholder: "How did they impact others or the world..." 
  },
  { 
    question: "Qualities or achievements to highlight.", 
    type: "textarea", 
    placeholder: "What made this person special?" 
  },
  culturalElementsQuestion,
  culturalDetailsQuestion,
  { 
    question: "Include specific cultural or religious elements?", 
    type: "textarea", 
    placeholder: "Any traditions or prayers to include?" 
  },
  { 
    question: "What comfort would you like to offer to the bereaved?", 
    type: "textarea", 
    placeholder: "Words of comfort or perspective to share..." 
  },
  { 
    question: "Any messages or prayers to convey?", 
    type: "textarea", 
    placeholder: "Special words, quotes, or readings?" 
  },
  { 
    question: "Closing words or sentiments?", 
    type: "textarea", 
    placeholder: "How would you like to conclude?" 
  }
];
