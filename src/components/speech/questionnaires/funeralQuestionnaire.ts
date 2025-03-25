
import { QuestionItem } from './types';
import { introductionQuestion } from './introductionQuestion';

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
    question: "Who is the speech for?", 
    type: "text", 
    placeholder: "Name and relation of the deceased" 
  },
  { 
    question: "Desired length of the speech?", 
    type: "text", 
    placeholder: "E.g., 5 minutes" 
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Reflective", "Respectful", "Celebratory of Life", "Solemn", "Hopeful"] 
  },
  { 
    question: "Share a cherished memory or story.", 
    type: "textarea", 
    placeholder: "Describe a meaningful experience..." 
  },
  { 
    question: "Qualities or achievements to highlight.", 
    type: "textarea", 
    placeholder: "What made this person special?" 
  },
  { 
    question: "Include specific cultural or religious elements?", 
    type: "textarea", 
    placeholder: "Any traditions or prayers to include?" 
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
