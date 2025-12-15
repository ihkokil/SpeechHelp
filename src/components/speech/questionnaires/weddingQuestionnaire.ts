
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

export const weddingQuestionnaire: QuestionItem[] = [
  introductionQuestion,
  { 
    question: "What is your name?", 
    type: "text", 
    placeholder: "E.g., John Smith",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is your relationship to the couple?", 
    type: "text", 
    placeholder: "E.g., Bride's Brother, Groom's Childhood Friend",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "Who are you giving this speech as?", 
    type: "radio", 
    options: ["Best Man", "Maid of Honor", "Father of the Bride", "Mother of the Bride", "Groom", "Bride", "Other"],
    condition: { question: "Will you be introduced before you speak?", value: "Yes" }
  },
  { 
    question: "What are the names of the couple getting married?", 
    type: "text", 
    placeholder: "E.g., Sarah and Michael" 
  },
  { 
    question: "How long have you known the couple?", 
    type: "text", 
    placeholder: "E.g., 15 years, Since childhood" 
  },
  { 
    question: "How did the couple meet?", 
    type: "textarea", 
    placeholder: "Share the story of how they came together..." 
  },
  { 
    question: "How long should the speech be (in minutes)?", 
    type: "text", 
    placeholder: "E.g., 3-5 minutes" 
  },
  { 
    question: "Preferred tone of the speech?", 
    type: "radio", 
    options: ["Humorous", "Sentimental", "Formal", "Casual", "Mix of humor and sentiment"] 
  },
  emotionalImpactQuestion,
  humorLevelQuestion,
  speechStructureQuestion,
  languageStyleQuestion,
  { 
    question: "Share a memorable story about the couple.", 
    type: "textarea", 
    placeholder: "Describe a meaningful or funny experience..." 
  },
  { 
    question: "What moment made you realize they were perfect for each other?", 
    type: "textarea", 
    placeholder: "Describe a specific moment or realization..." 
  },
  { 
    question: "What qualities do you admire about the couple?", 
    type: "textarea", 
    placeholder: "E.g., kindness, humor, dedication..." 
  },
  culturalElementsQuestion,
  culturalDetailsQuestion,
  { 
    question: "Would you like to include any personal anecdotes?", 
    type: "radio", 
    options: ["Yes", "No"]
  },
  { 
    question: "Personal anecdotes", 
    type: "textarea", 
    placeholder: "Share any memorable moments or stories...",
    condition: { question: "Would you like to include any personal anecdotes?", value: "Yes" }
  },
  { 
    question: "Would you like to end with a toast?", 
    type: "radio", 
    options: ["Yes", "No"]
  },
  { 
    question: "Toast details", 
    type: "textarea", 
    placeholder: "Provide details for your toast or we'll suggest one",
    condition: { question: "Would you like to end with a toast?", value: "Yes" }
  },
  { 
    question: "Any specific topics to avoid or include?", 
    type: "textarea", 
    placeholder: "Any specific mentions or topics to avoid..." 
  },
  {
    question: "Words of wisdom or advice for the couple?",
    type: "textarea",
    placeholder: "Share any advice or wishes for their future together..."
  }
];
