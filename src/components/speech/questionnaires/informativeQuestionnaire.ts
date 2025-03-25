
import { QuestionItem } from './types';
import { introductionQuestion } from './introductionQuestion';

export const informativeQuestionnaire: QuestionItem[] = [
  introductionQuestion,
  { 
    question: "What is your name?", 
    type: "text", 
    placeholder: "E.g., Professor Alex Wang",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What are your credentials?", 
    type: "text", 
    placeholder: "E.g., PhD in Economics, Certified Expert",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is the topic or subject?", 
    type: "textarea", 
    placeholder: "What will you be explaining or teaching about?" 
  },
  { 
    question: "Audience type and size?", 
    type: "text", 
    placeholder: "E.g., 100 college students, Community group" 
  },
  { 
    question: "Desired length of the speech?", 
    type: "text", 
    placeholder: "E.g., 15 minutes" 
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Educational", "Engaging", "Clear", "Authoritative", "Conversational"] 
  },
  { 
    question: "Include specific data or research?", 
    type: "textarea", 
    placeholder: "Any statistics or findings to share?" 
  },
  { 
    question: "Key message or takeaway?", 
    type: "textarea", 
    placeholder: "What should the audience learn?" 
  },
  { 
    question: "Any visuals or demonstrations to reference?", 
    type: "textarea", 
    placeholder: "Describe any visual aids if applicable" 
  },
  { 
    question: "Closing summary or statement?", 
    type: "textarea", 
    placeholder: "How would you like to conclude?" 
  }
];
