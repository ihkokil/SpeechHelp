
import { QuestionItem } from './types';
import { introductionQuestion } from './introductionQuestion';

export const motivationalQuestionnaire: QuestionItem[] = [
  introductionQuestion,
  { 
    question: "What is your name?", 
    type: "text", 
    placeholder: "E.g., Michael Chen",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "Why are you speaking today?", 
    type: "text", 
    placeholder: "E.g., Entrepreneur and Coach, Invited Guest",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "Who is the audience?", 
    type: "text", 
    placeholder: "E.g., Students, Athletes, Sales Team" 
  },
  { 
    question: "Speech duration preference?", 
    type: "text", 
    placeholder: "E.g., 20 minutes" 
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Energizing", "Encouraging", "Powerful", "Inspirational", "Empowering"] 
  },
  { 
    question: "Share an inspiring story or example.", 
    type: "textarea", 
    placeholder: "Describe a motivational experience..." 
  },
  { 
    question: "Key message or theme?", 
    type: "textarea", 
    placeholder: "E.g., overcoming obstacles, finding purpose..." 
  },
  { 
    question: "Include motivational quotes or anecdotes?", 
    type: "textarea", 
    placeholder: "Any specific quotes or stories to include?" 
  },
  { 
    question: "Any challenges or obstacles to address?", 
    type: "textarea", 
    placeholder: "What difficulties might the audience face?" 
  },
  { 
    question: "Call to action or advice?", 
    type: "textarea", 
    placeholder: "What do you want the audience to do?" 
  },
  { 
    question: "Closing remarks?", 
    type: "textarea", 
    placeholder: "How would you like to conclude?" 
  }
];
