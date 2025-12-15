
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
    question: "Why are you passionate about this topic?", 
    type: "textarea", 
    placeholder: "Share your personal connection to this subject..." 
  },
  { 
    question: "What is the big question your talk addresses?", 
    type: "textarea", 
    placeholder: "E.g., How can we solve climate change at a local level?" 
  },
  { 
    question: "Audience type and size?", 
    type: "text", 
    placeholder: "E.g., General public, 300 attendees" 
  },
  { 
    question: "Desired length of the talk (in minutes)?", 
    type: "text", 
    placeholder: "E.g., 15 minutes"
  },
  { 
    question: "Tone of the talk?", 
    type: "radio", 
    options: ["Engaging", "Thought-Provoking", "Storytelling", "Educational", "Conversational"] 
  },
  emotionalImpactQuestion,
  humorLevelQuestion,
  speechStructureQuestion,
  languageStyleQuestion,
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
    question: "What counterintuitive or surprising point do you want to make?", 
    type: "textarea", 
    placeholder: "Share something unexpected that challenges assumptions..." 
  },
  culturalElementsQuestion,
  culturalDetailsQuestion,
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
    question: "How do you want your audience to be transformed?", 
    type: "textarea", 
    placeholder: "What change in thinking or action do you hope for?" 
  },
  { 
    question: "Ending or closing statement?", 
    type: "textarea", 
    placeholder: "How would you like to conclude?" 
  }
];
