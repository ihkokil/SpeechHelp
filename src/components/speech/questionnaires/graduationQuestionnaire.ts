
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
    type: "radio", 
    options: ["Valedictorian", "Guest Speaker", "Faculty Member", "Administrator", "Other"],
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "Please specify your role", 
    type: "text", 
    placeholder: "E.g., Alumni, Parent Representative",
    condition: { question: "What is your role at this graduation?", value: "Other" }
  },
  { 
    question: "Who are you addressing?", 
    type: "text", 
    placeholder: "E.g., Graduates, Faculty, Parents" 
  },
  { 
    question: "What type of institution is this graduation for?", 
    type: "radio", 
    options: ["High School", "College/University", "Graduate School", "Trade School", "Other"]
  },
  { 
    question: "What major challenges did the graduates overcome?", 
    type: "textarea", 
    placeholder: "E.g., pandemic disruptions, specific academic challenges..." 
  },
  { 
    question: "Desired length of the speech (in minutes)?", 
    type: "text", 
    placeholder: "E.g., 5-7 minutes"
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Inspirational", "Reflective", "Challenging", "Celebratory", "Formal"] 
  },
  emotionalImpactQuestion,
  humorLevelQuestion,
  speechStructureQuestion,
  languageStyleQuestion,
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
  culturalElementsQuestion,
  culturalDetailsQuestion,
  { 
    question: "Is there a call to action or advice?", 
    type: "textarea", 
    placeholder: "What do you want graduates to do or remember?" 
  },
  { 
    question: "What wisdom about the 'real world' would you like to share?", 
    type: "textarea", 
    placeholder: "E.g., career advice, life lessons..." 
  },
  { 
    question: "Closing remarks or statement?", 
    type: "textarea", 
    placeholder: "How would you like to conclude?" 
  }
];
