
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

export const retirementQuestionnaire: QuestionItem[] = [
  introductionQuestion,
  { 
    question: "What is your name?", 
    type: "text", 
    placeholder: "E.g., David Miller",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is your relationship to the event?", 
    type: "text", 
    placeholder: "E.g., Colleague of 15 years, Manager",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "Who is retiring?", 
    type: "text", 
    placeholder: "Name and position of retiree" 
  },
  { 
    question: "How long have you known the retiree?", 
    type: "text", 
    placeholder: "E.g., 20 years, Since college" 
  },
  { 
    question: "How long were they with the organization?", 
    type: "text", 
    placeholder: "E.g., 30 years, Since founding" 
  },
  { 
    question: "What are their retirement plans?", 
    type: "textarea", 
    placeholder: "E.g., Travel, Hobbies, New ventures" 
  },
  { 
    question: "Desired length of the speech (in minutes)?", 
    type: "text", 
    placeholder: "E.g., 5 minutes"
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Grateful", "Reflective", "Celebratory", "Humorous", "Admiring"] 
  },
  emotionalImpactQuestion,
  humorLevelQuestion,
  speechStructureQuestion,
  languageStyleQuestion,
  { 
    question: "Share a memorable experience or story.", 
    type: "textarea", 
    placeholder: "Describe a significant moment..." 
  },
  { 
    question: "What was their biggest contribution or achievement?", 
    type: "textarea", 
    placeholder: "Describe their most significant impact..." 
  },
  { 
    question: "How has the organization or team changed during their tenure?", 
    type: "textarea", 
    placeholder: "Describe growth, evolution, or transformation..." 
  },
  culturalElementsQuestion,
  culturalDetailsQuestion,
  { 
    question: "Qualities or achievements to highlight?", 
    type: "textarea", 
    placeholder: "What contributions or strengths to recognize?" 
  },
  { 
    question: "Any specific thank yous or acknowledgments?", 
    type: "textarea", 
    placeholder: "Who or what should be acknowledged?" 
  },
  { 
    question: "Is there a message or theme?", 
    type: "textarea", 
    placeholder: "Any central point to convey?" 
  },
  { 
    question: "Closing words or farewell statement?", 
    type: "textarea", 
    placeholder: "How would you like to conclude?" 
  }
];
