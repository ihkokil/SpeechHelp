
import { QuestionItem } from './types';
import { introductionQuestion } from './introductionQuestion';

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
    question: "Desired length of the speech?", 
    type: "text", 
    placeholder: "E.g., 5 minutes" 
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Grateful", "Reflective", "Celebratory", "Humorous", "Admiring"] 
  },
  { 
    question: "Share a memorable experience or story.", 
    type: "textarea", 
    placeholder: "Describe a significant moment..." 
  },
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
