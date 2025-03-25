
import { QuestionItem } from './types';
import { introductionQuestion } from './introductionQuestion';

export const keynoteQuestionnaire: QuestionItem[] = [
  introductionQuestion,
  { 
    question: "What is your name and title?", 
    type: "text", 
    placeholder: "E.g., Dr. Robert Lee, CEO",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What organization do you represent?", 
    type: "text", 
    placeholder: "E.g., Future Tech, Industry Association",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is the event or conference?", 
    type: "text", 
    placeholder: "E.g., Annual Industry Summit, Tech Conference" 
  },
  { 
    question: "Audience type and size?", 
    type: "text", 
    placeholder: "E.g., 500 industry professionals" 
  },
  { 
    question: "Desired length of the address?", 
    type: "text", 
    placeholder: "E.g., 30 minutes" 
  },
  { 
    question: "Tone of the address?", 
    type: "radio", 
    options: ["Inspirational", "Educational", "Visionary", "Strategic", "Authoritative"] 
  },
  { 
    question: "Main topic or theme?", 
    type: "textarea", 
    placeholder: "What's the central focus of your address?" 
  },
  { 
    question: "Include industry trends or insights?", 
    type: "textarea", 
    placeholder: "Any specific developments to highlight?" 
  },
  { 
    question: "Key message or takeaway?", 
    type: "textarea", 
    placeholder: "What should the audience remember?" 
  },
  { 
    question: "Any specific challenges or opportunities to address?", 
    type: "textarea", 
    placeholder: "What issues are important to discuss?" 
  },
  { 
    question: "Closing statement or call to action?", 
    type: "textarea", 
    placeholder: "How would you like to conclude?" 
  }
];
