
import { QuestionItem } from './types';
import { introductionQuestion } from './introductionQuestion';

export const persuasiveQuestionnaire: QuestionItem[] = [
  introductionQuestion,
  { 
    question: "What is your name?", 
    type: "text", 
    placeholder: "E.g., Maria Garcia",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is your background relevant to this topic?", 
    type: "text", 
    placeholder: "E.g., Environmental Activist, Industry Expert",
    condition: { question: "Will you be introduced before you speak?", value: "No" }
  },
  { 
    question: "What is the topic or issue?", 
    type: "textarea", 
    placeholder: "What are you advocating for or against?" 
  },
  { 
    question: "Audience type and size?", 
    type: "text", 
    placeholder: "E.g., City Council, Voter Group of 200" 
  },
  { 
    question: "Desired length of the speech?", 
    type: "text", 
    placeholder: "E.g., 10 minutes" 
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Convincing", "Passionate", "Logical", "Urgent", "Balanced"] 
  },
  { 
    question: "Main argument or point of view?", 
    type: "textarea", 
    placeholder: "What position are you taking?" 
  },
  { 
    question: "Include data or evidence to support your argument?", 
    type: "textarea", 
    placeholder: "Any facts or research to include?" 
  },
  { 
    question: "Any counterarguments to address?", 
    type: "textarea", 
    placeholder: "What opposing views will you respond to?" 
  },
  { 
    question: "Is there a call to action?", 
    type: "textarea", 
    placeholder: "What do you want your audience to do?" 
  },
  { 
    question: "Closing persuasive statement?", 
    type: "textarea", 
    placeholder: "How would you like to conclude?" 
  }
];
