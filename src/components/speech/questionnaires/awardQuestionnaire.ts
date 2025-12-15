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
    question: "What is the significance of this award?", 
    type: "textarea", 
    placeholder: "Why this award matters or what it represents..." 
  },
  { 
    question: "Are you presenting or accepting the award?", 
    type: "radio", 
    options: ["Presenting the award", "Accepting the award"] 
  },
  { 
    question: "If presenting, who is the recipient?", 
    type: "text", 
    placeholder: "Full name and position of the recipient",
    condition: { question: "Are you presenting or accepting the award?", value: "Presenting the award" }
  },
  { 
    question: "If accepting, who is presenting the award?", 
    type: "text", 
    placeholder: "Full name and role of the presenter",
    condition: { question: "Are you presenting or accepting the award?", value: "Accepting the award" }
  },
  { 
    question: "Desired length of the speech (in minutes)?", 
    type: "text", 
    placeholder: "E.g., 3 minutes"
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Celebratory", "Gracious", "Formal", "Appreciative", "Inspiring"] 
  },
  emotionalImpactQuestion,
  humorLevelQuestion,
  speechStructureQuestion,
  languageStyleQuestion,
  { 
    question: "What was the selection process for this award?", 
    type: "textarea", 
    placeholder: "How was the recipient chosen...",
    condition: { question: "Are you presenting or accepting the award?", value: "Presenting the award" }
  },
  { 
    question: "What journey led to this achievement?", 
    type: "textarea", 
    placeholder: "Share the path that led to this recognition...",
    condition: { question: "Are you presenting or accepting the award?", value: "Accepting the award" }
  },
  { 
    question: "Key achievements or qualifications to highlight?", 
    type: "textarea", 
    placeholder: "What merits or contributions to mention?" 
  },
  culturalElementsQuestion,
  culturalDetailsQuestion,
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
