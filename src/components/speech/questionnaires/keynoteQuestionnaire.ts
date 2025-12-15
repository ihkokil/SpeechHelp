
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
    question: "What is the theme of the event?", 
    type: "text", 
    placeholder: "E.g., 'Innovation for the Future', 'Building Resilience'" 
  },
  { 
    question: "Audience type and size?", 
    type: "text", 
    placeholder: "E.g., 500 industry professionals" 
  },
  { 
    question: "What is the current industry landscape?", 
    type: "textarea", 
    placeholder: "Describe relevant trends, challenges, or opportunities..." 
  },
  { 
    question: "Desired length of the address (in minutes)?", 
    type: "text", 
    placeholder: "E.g., 30 minutes"
  },
  { 
    question: "Tone of the address?", 
    type: "radio", 
    options: ["Inspirational", "Educational", "Visionary", "Strategic", "Authoritative"] 
  },
  emotionalImpactQuestion,
  humorLevelQuestion,
  speechStructureQuestion,
  languageStyleQuestion,
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
    question: "What predictions or future outlook would you like to share?", 
    type: "textarea", 
    placeholder: "Your vision for the future of your industry or field..." 
  },
  culturalElementsQuestion,
  culturalDetailsQuestion,
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
    question: "How does your message relate to the audience's interests?", 
    type: "textarea", 
    placeholder: "How will this impact or benefit the audience..." 
  },
  { 
    question: "Closing statement or call to action?", 
    type: "textarea", 
    placeholder: "How would you like to conclude?" 
  }
];
