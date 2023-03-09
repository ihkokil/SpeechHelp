
import { QuestionItem } from './types';
import { introductionQuestion } from './introductionQuestion';

export const entertainingQuestionnaire: QuestionItem[] = [
  introductionQuestion,
  { 
    question: "What is your name?", 
    type: "text", 
    placeholder: "E.g., Sam Brown",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is your role at this event?", 
    type: "text", 
    placeholder: "E.g., Guest Speaker, Master of Ceremonies",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "Who is the audience?", 
    type: "text", 
    placeholder: "E.g., Party Guests, Event Attendees" 
  },
  { 
    question: "Desired length of the speech?", 
    type: "text", 
    placeholder: "E.g., 5 minutes" 
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Fun", "Amusing", "Witty", "Lighthearted", "Engaging"] 
  },
  { 
    question: "Share a funny or engaging story.", 
    type: "textarea", 
    placeholder: "Describe an entertaining experience..." 
  },
  { 
    question: "Any specific jokes or anecdotes to include?", 
    type: "textarea", 
    placeholder: "Share any humorous content..." 
  },
  { 
    question: "Is there a theme or message?", 
    type: "textarea", 
    placeholder: "Any central point amid the entertainment?" 
  },
  { 
    question: "Closing remarks or humorous ending?", 
    type: "textarea", 
    placeholder: "How would you like to conclude?" 
  }
];
