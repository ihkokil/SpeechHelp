
import { QuestionItem } from './types';
import { introductionQuestion } from './introductionQuestion';

export const graduationQuestionnaire: QuestionItem[] = [
  introductionQuestion,
  { 
    question: "What is your name?", 
    type: "text", 
    placeholder: "E.g., Dr. Jane Smith",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is your role at this graduation?", 
    type: "text", 
    placeholder: "E.g., Department Chair, Valedictorian",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "Who are you addressing?", 
    type: "text", 
    placeholder: "E.g., Graduates, Faculty, Parents" 
  },
  { 
    question: "Your role in the event?", 
    type: "radio", 
    options: ["Valedictorian", "Guest Speaker", "Faculty Member", "Administrator", "Other"] 
  },
  { 
    question: "Desired length of the speech?", 
    type: "text", 
    placeholder: "E.g., 5-7 minutes" 
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Inspirational", "Reflective", "Challenging", "Celebratory", "Formal"] 
  },
  { 
    question: "Key message or theme?", 
    type: "textarea", 
    placeholder: "E.g., embracing change, perseverance..." 
  },
  { 
    question: "Share a personal story or experience.", 
    type: "textarea", 
    placeholder: "Describe a relevant experience..." 
  },
  { 
    question: "Include a famous quote or saying?", 
    type: "textarea", 
    placeholder: "Specify or we'll suggest one" 
  },
  { 
    question: "Specific achievements or milestones to mention?", 
    type: "textarea", 
    placeholder: "E.g., class achievements, special awards..." 
  },
  { 
    question: "Is there a call to action or advice?", 
    type: "textarea", 
    placeholder: "What do you want graduates to do or remember?" 
  },
  { 
    question: "Closing remarks or statement?", 
    type: "textarea", 
    placeholder: "How would you like to conclude?" 
  }
];
