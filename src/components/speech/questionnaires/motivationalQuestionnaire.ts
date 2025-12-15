
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

export const motivationalQuestionnaire: QuestionItem[] = [
  introductionQuestion,
  { 
    question: "What is your name?", 
    type: "text", 
    placeholder: "E.g., Michael Chen",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "Why are you speaking today?", 
    type: "text", 
    placeholder: "E.g., Entrepreneur and Coach, Invited Guest",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "Who is the audience?", 
    type: "text", 
    placeholder: "E.g., Students, Athletes, Sales Team" 
  },
  { 
    question: "What specific challenges is your audience facing?", 
    type: "textarea", 
    placeholder: "Describe obstacles or difficulties they're experiencing..." 
  },
  { 
    question: "Have you overcome similar challenges?", 
    type: "textarea", 
    placeholder: "Share your personal experience with similar situations..." 
  },
  { 
    question: "Speech duration preference (in minutes)?", 
    type: "text", 
    placeholder: "E.g., 20 minutes"
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Energizing", "Encouraging", "Powerful", "Inspirational", "Empowering"] 
  },
  emotionalImpactQuestion,
  humorLevelQuestion,
  speechStructureQuestion,
  languageStyleQuestion,
  { 
    question: "Share an inspiring story or example.", 
    type: "textarea", 
    placeholder: "Describe a motivational experience..." 
  },
  { 
    question: "Key message or theme?", 
    type: "textarea", 
    placeholder: "E.g., overcoming obstacles, finding purpose..." 
  },
  { 
    question: "Include motivational quotes or anecdotes?", 
    type: "textarea", 
    placeholder: "Any specific quotes or stories to include?" 
  },
  { 
    question: "What is your personal philosophy about overcoming challenges?", 
    type: "textarea", 
    placeholder: "Share your beliefs about resilience, growth, etc..." 
  },
  culturalElementsQuestion,
  culturalDetailsQuestion,
  { 
    question: "Any challenges or obstacles to address?", 
    type: "textarea", 
    placeholder: "What difficulties might the audience face?" 
  },
  { 
    question: "Call to action or advice?", 
    type: "textarea", 
    placeholder: "What do you want the audience to do?" 
  },
  { 
    question: "What specific steps or practices would you recommend?", 
    type: "textarea", 
    placeholder: "Share actionable advice the audience can implement..." 
  },
  { 
    question: "Closing remarks?", 
    type: "textarea", 
    placeholder: "How would you like to conclude?" 
  }
];
