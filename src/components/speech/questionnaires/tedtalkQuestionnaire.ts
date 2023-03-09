
import { QuestionItem } from './types';
import { introductionQuestion } from './introductionQuestion';

export const tedtalkQuestionnaire: QuestionItem[] = [
  introductionQuestion,
  { 
    question: "What is your name?", 
    type: "text", 
    placeholder: "E.g., Dr. Sarah Jones",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is your professional background?", 
    type: "text", 
    placeholder: "E.g., Marine Biologist, Tech Entrepreneur",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is the main idea or topic?", 
    type: "textarea", 
    placeholder: "Summarize your talk's focus..." 
  },
  { 
    question: "Audience type and size?", 
    type: "text", 
    placeholder: "E.g., General public, 300 attendees" 
  },
  { 
    question: "Desired length of the talk?", 
    type: "text", 
    placeholder: "E.g., 15 minutes" 
  },
  { 
    question: "Tone of the talk?", 
    type: "radio", 
    options: ["Engaging", "Thought-Provoking", "Storytelling", "Educational", "Conversational"] 
  },
  { 
    question: "Share a personal story or experience.", 
    type: "textarea", 
    placeholder: "Describe a relevant experience..." 
  },
  { 
    question: "Include relevant data or research?", 
    type: "textarea", 
    placeholder: "Any statistics or findings to share?" 
  },
  { 
    question: "Key message or takeaway?", 
    type: "textarea", 
    placeholder: "What should the audience remember?" 
  },
  { 
    question: "Any visual aids to reference?", 
    type: "textarea", 
    placeholder: "Describe slides or props if applicable" 
  },
  { 
    question: "Ending or closing statement?", 
    type: "textarea", 
    placeholder: "How would you like to conclude?" 
  }
];
