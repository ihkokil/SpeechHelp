
import { QuestionItem } from './types';
import { introductionQuestion } from './introductionQuestion';

export const awardQuestionnaire: QuestionItem[] = [
  introductionQuestion,
  { 
    question: "What is your name?", 
    type: "text", 
    placeholder: "E.g., Jennifer Kim",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is your role in the ceremony?", 
    type: "text", 
    placeholder: "E.g., Award Committee Chair, Host",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is the award?", 
    type: "text", 
    placeholder: "E.g., Employee of the Year, Achievement Award" 
  },
  { 
    question: "Are you presenting or accepting the award?", 
    type: "radio", 
    options: ["Presenting the award", "Accepting the award"] 
  },
  { 
    question: "Desired length of the speech?", 
    type: "text", 
    placeholder: "E.g., 3 minutes" 
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Celebratory", "Gracious", "Formal", "Appreciative", "Inspiring"] 
  },
  { 
    question: "Key achievements or qualifications to highlight?", 
    type: "textarea", 
    placeholder: "What merits or contributions to mention?" 
  },
  { 
    question: "Any specific thank yous or acknowledgments?", 
    type: "textarea", 
    placeholder: "Who would you like to recognize?" 
  },
  { 
    question: "Is there a message or theme?", 
    type: "textarea", 
    placeholder: "Any central point to convey?" 
  },
  { 
    question: "Closing remarks or acceptance statement?", 
    type: "textarea", 
    placeholder: "How would you like to conclude?" 
  }
];
