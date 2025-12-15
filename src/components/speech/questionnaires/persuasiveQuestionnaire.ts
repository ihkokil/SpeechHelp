
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
    question: "Why are you passionate about this issue?", 
    type: "textarea", 
    placeholder: "Share your personal connection or motivation..." 
  },
  { 
    question: "What is at stake if no action is taken?", 
    type: "textarea", 
    placeholder: "Describe potential consequences or missed opportunities..." 
  },
  { 
    question: "Audience type and size?", 
    type: "text", 
    placeholder: "E.g., City Council, Voter Group of 200" 
  },
  { 
    question: "What does the audience currently believe about this topic?", 
    type: "textarea", 
    placeholder: "Describe existing opinions or misconceptions..." 
  },
  { 
    question: "Desired length of the speech (in minutes)?", 
    type: "text", 
    placeholder: "E.g., 10 minutes"
  },
  { 
    question: "Tone of the speech?", 
    type: "radio", 
    options: ["Convincing", "Passionate", "Logical", "Urgent", "Balanced"] 
  },
  emotionalImpactQuestion,
  humorLevelQuestion,
  speechStructureQuestion,
  languageStyleQuestion,
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
    question: "What are the benefits of your proposal?", 
    type: "textarea", 
    placeholder: "List the advantages or positive outcomes..." 
  },
  culturalElementsQuestion,
  culturalDetailsQuestion,
  { 
    question: "Any counterarguments to address?", 
    type: "textarea", 
    placeholder: "What opposing views will you respond to?" 
  },
  { 
    question: "How will you address skepticism?", 
    type: "textarea", 
    placeholder: "Strategies for convincing doubtful audience members..." 
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
