
import { QuestionItem } from './types';
import { introductionQuestion } from './introductionQuestion';

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
    question: "Who is the audience?", 
    type: "text", 
    placeholder: "E.g., Family Members, Community Group" 
  },
  { 
    question: "Desired length of the speech?", 
    type: "text", 
    placeholder: "E.g., 5 minutes" 
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Formal", "Casual", "Enthusiastic", "Serious", "Mixed"] 
  },
  { 
    question: "Main topic or message?", 
    type: "textarea", 
    placeholder: "What's the primary focus?" 
  },
  { 
    question: "Include specific stories or anecdotes?", 
    type: "textarea", 
    placeholder: "Any relevant experiences to share?" 
  },
  { 
    question: "Is there a theme or takeaway?", 
    type: "textarea", 
    placeholder: "What should the audience remember?" 
  },
  { 
    question: "Closing remarks or conclusion?", 
    type: "textarea", 
    placeholder: "How would you like to end your speech?" 
  }
];
