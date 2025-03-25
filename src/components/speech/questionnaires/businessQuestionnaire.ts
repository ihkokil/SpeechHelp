
import { QuestionItem } from './types';
import { introductionQuestion } from './introductionQuestion';

export const businessQuestionnaire: QuestionItem[] = [
  introductionQuestion,
  { 
    question: "What is your name and title?", 
    type: "text", 
    placeholder: "E.g., John Davis, Marketing Director",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What company do you represent?", 
    type: "text", 
    placeholder: "E.g., XYZ Corporation",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "Purpose of the speech?", 
    type: "radio", 
    options: ["Product Launch", "Team Meeting", "Corporate Training", "Sales Pitch", "Company Announcement"] 
  },
  { 
    question: "Audience type and size?", 
    type: "text", 
    placeholder: "E.g., 50 clients, Executive team of 8" 
  },
  { 
    question: "Desired speech length?", 
    type: "text", 
    placeholder: "E.g., 10 minutes" 
  },
  { 
    question: "Speech tone?", 
    type: "radio", 
    options: ["Motivational", "Informative", "Persuasive", "Professional", "Conversational"] 
  },
  { 
    question: "Key message or objective?", 
    type: "textarea", 
    placeholder: "What's the main point you want to convey?" 
  },
  { 
    question: "Include industry-specific terms or data?", 
    type: "textarea", 
    placeholder: "Any technical information to include?" 
  },
  { 
    question: "Any success stories or case studies to mention?", 
    type: "textarea", 
    placeholder: "Share relevant examples..." 
  },
  { 
    question: "Is there a call to action?", 
    type: "textarea", 
    placeholder: "What do you want your audience to do?" 
  },
  { 
    question: "Closing remarks?", 
    type: "textarea", 
    placeholder: "How would you like to conclude?" 
  }
];
