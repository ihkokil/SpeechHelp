
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

export const otherQuestionnaire: QuestionItem[] = [
  introductionQuestion,
  { 
    question: "What is your name?", 
    type: "text", 
    placeholder: "E.g., Taylor Wilson",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is your role at this event?", 
    type: "text", 
    placeholder: "E.g., Host, Guest Speaker, Organizer",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is the event or occasion?", 
    type: "text", 
    placeholder: "Describe the specific occasion" 
  },
  { 
    question: "What is the purpose of your speech?", 
    type: "textarea", 
    placeholder: "Why are you speaking at this event..." 
  },
  { 
    question: "Who is the audience?", 
    type: "text", 
    placeholder: "E.g., Family Members, Community Group" 
  },
  { 
    question: "What is the audience's familiarity with the topic?", 
    type: "radio", 
    options: ["Very familiar", "Somewhat familiar", "Little familiarity", "No familiarity"] 
  },
  { 
    question: "Desired length of the speech (in minutes)?", 
    type: "text", 
    placeholder: "E.g., 5 minutes"
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Formal", "Casual", "Enthusiastic", "Serious", "Mixed"] 
  },
  emotionalImpactQuestion,
  humorLevelQuestion,
  speechStructureQuestion,
  languageStyleQuestion,
  { 
    question: "Main topic or message?", 
    type: "textarea", 
    placeholder: "What's the primary focus?" 
  },
  { 
    question: "Why is this topic important to you?", 
    type: "textarea", 
    placeholder: "Share your personal connection..." 
  },
  { 
    question: "Include specific stories or anecdotes?", 
    type: "textarea", 
    placeholder: "Any relevant experiences to share?" 
  },
  culturalElementsQuestion,
  culturalDetailsQuestion,
  { 
    question: "What do you want the audience to think or feel?", 
    type: "textarea", 
    placeholder: "Describe the desired impact of your speech..." 
  },
  { 
    question: "Is there a theme or takeaway?", 
    type: "textarea", 
    placeholder: "What should the audience remember?" 
  },
  { 
    question: "Any specific calls to action?", 
    type: "textarea", 
    placeholder: "What do you want the audience to do?" 
  },
  { 
    question: "Closing remarks or conclusion?", 
    type: "textarea", 
    placeholder: "How would you like to end your speech?" 
  }
];
