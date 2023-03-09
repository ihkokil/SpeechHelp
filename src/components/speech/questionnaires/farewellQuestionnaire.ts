
import { QuestionItem } from './types';
import { introductionQuestion } from './introductionQuestion';

export const farewellQuestionnaire: QuestionItem[] = [
  introductionQuestion,
  { 
    question: "What is your name?", 
    type: "text", 
    placeholder: "E.g., Emma Davis",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is your position or relationship to the group?", 
    type: "text", 
    placeholder: "E.g., Team Leader, Departing Employee",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "Who is the audience?", 
    type: "text", 
    placeholder: "E.g., Colleagues, Classmates, Friends" 
  },
  { 
    question: "Desired length of the speech?", 
    type: "text", 
    placeholder: "E.g., 5 minutes" 
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Nostalgic", "Grateful", "Hopeful", "Reflective", "Upbeat"] 
  },
  { 
    question: "Share a meaningful experience or memory.", 
    type: "textarea", 
    placeholder: "Describe a significant moment..." 
  },
  { 
    question: "Qualities or achievements to highlight?", 
    type: "textarea", 
    placeholder: "What would you like to recognize?" 
  },
  { 
    question: "Any specific thank yous or acknowledgments?", 
    type: "textarea", 
    placeholder: "Who would you like to mention?" 
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
