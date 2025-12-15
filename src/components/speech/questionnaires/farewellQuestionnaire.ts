
import { QuestionItem } from './types';
import { 
  introductionQuestion,
  emotionalImpactQuestion,
  humorLevelQuestion,
  speechStructureQuestion,
  languageStyleQuestion,
  culturalElementsQuestion,
  culturalDetailsQuestion
} from './introductionQuestion';

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
    question: "How long were you with this group or organization?", 
    type: "text", 
    placeholder: "E.g., 5 years, 3 semesters" 
  },
  { 
    question: "What are your future plans?", 
    type: "textarea", 
    placeholder: "Share what's next in your journey..." 
  },
  { 
    question: "Desired length of the speech (in minutes)?", 
    type: "text", 
    placeholder: "E.g., 5 minutes"
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Nostalgic", "Grateful", "Hopeful", "Reflective", "Upbeat"] 
  },
  emotionalImpactQuestion,
  humorLevelQuestion,
  speechStructureQuestion,
  languageStyleQuestion,
  { 
    question: "Share a meaningful experience or memory.", 
    type: "textarea", 
    placeholder: "Describe a significant moment..." 
  },
  { 
    question: "What growth or change occurred during your time here?", 
    type: "textarea", 
    placeholder: "Describe how you or the organization evolved..." 
  },
  { 
    question: "Qualities or achievements to highlight?", 
    type: "textarea", 
    placeholder: "What would you like to recognize?" 
  },
  culturalElementsQuestion,
  culturalDetailsQuestion,
  { 
    question: "Any specific thank yous or acknowledgments?", 
    type: "textarea", 
    placeholder: "Who would you like to mention?" 
  },
  { 
    question: "What lessons or values will you take with you?", 
    type: "textarea", 
    placeholder: "Share what you've learned or valued most..." 
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
