
import { QuestionItem } from './types';
import { introductionQuestion } from './introductionQuestion';

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
    question: "Who are you in relation to the wedding?", 
    type: "radio", 
    options: ["Best Man", "Maid of Honor", "Father of the Bride", "Mother of the Bride", "Groom", "Bride", "Other"] 
  },
  { 
    question: "How long should the speech be?", 
    type: "text", 
    placeholder: "E.g., 3-5 minutes" 
  },
  { 
    question: "Preferred tone of the speech?", 
    type: "radio", 
    options: ["Humorous", "Sentimental", "Formal", "Casual", "Mix of humor and sentiment"] 
  },
  { 
    question: "Share a memorable story about the couple.", 
    type: "textarea", 
    placeholder: "Describe a meaningful or funny experience..." 
  },
  { 
    question: "Qualities you admire about the bride/groom.", 
    type: "textarea", 
    placeholder: "E.g., kindness, humor, dedication..." 
  },
  { 
    question: "Is there a theme or message you want to convey?", 
    type: "textarea", 
    placeholder: "E.g., growth together, overcoming challenges..." 
  },
  { 
    question: "Include cultural or religious references?", 
    type: "textarea", 
    placeholder: "Specify if applicable, or leave blank" 
  },
  { 
    question: "Any inside jokes or personal anecdotes?", 
    type: "textarea", 
    placeholder: "Share any memorable moments or stories..." 
  },
  { 
    question: "End with a toast?", 
    type: "textarea", 
    placeholder: "Provide details or we'll suggest one" 
  },
  { 
    question: "Anything else to include or avoid?", 
    type: "textarea", 
    placeholder: "Any specific mentions or topics to avoid..." 
  }
];
