
import { QuestionItem } from './types';
import { introductionQuestion } from './introductionQuestion';

export const socialQuestionnaire: QuestionItem[] = [
  introductionQuestion,
  { 
    question: "What is your name?", 
    type: "text", 
    placeholder: "E.g., Lisa Johnson",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is your relation to this event?", 
    type: "text", 
    placeholder: "E.g., Host, Guest of Honor, Friend",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "Who is the audience?", 
    type: "text", 
    placeholder: "E.g., Dinner Guests, Friends at a Gathering" 
  },
  { 
    question: "Speech type?", 
    type: "radio", 
    options: ["Toast", "Roast", "Welcome Address", "Thank You Speech", "Casual Remarks"] 
  },
  { 
    question: "Desired length of the speech?", 
    type: "text", 
    placeholder: "E.g., 2 minutes" 
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Humorous", "Lighthearted", "Warm", "Appreciative", "Playful"] 
  },
  { 
    question: "Share a funny or memorable story.", 
    type: "textarea", 
    placeholder: "Describe an amusing or relevant moment..." 
  },
  { 
    question: "Any specific anecdotes or jokes to include?", 
    type: "textarea", 
    placeholder: "Share any entertaining moments..." 
  },
  { 
    question: "Is there a message or theme?", 
    type: "textarea", 
    placeholder: "Any central point to convey?" 
  },
  { 
    question: "Closing remarks or toast?", 
    type: "textarea", 
    placeholder: "How would you like to conclude?" 
  }
];
