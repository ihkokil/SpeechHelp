
import { QuestionItem } from './types';

export const weddingQuestionnaire: QuestionItem[] = [
  { 
    question: "Will you be introduced before you speak?",
    type: "radio",
    options: ["Yes", "No", "Unsure"]
  },
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
    question: "What qualities do you admire about the couple?", 
    type: "textarea", 
    placeholder: "E.g., kindness, humor, dedication..." 
  },
  { 
    question: "Would you like to include cultural or religious references?", 
    type: "radio", 
    options: ["Yes", "No"]
  },
  { 
    question: "Cultural or religious details", 
    type: "textarea", 
    placeholder: "Please provide details about specific cultural or religious elements to include",
    condition: { question: "Would you like to include cultural or religious references?", value: "Yes" }
  },
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
  }
];
