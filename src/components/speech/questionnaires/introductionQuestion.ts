
import { QuestionItem } from './types';

// Introduction question to add to all questionnaires
export const introductionQuestion: QuestionItem = { 
  question: "Will you be introduced before you speak?", 
  type: "radio" as const, 
  options: ["Yes", "No", "Unsure"]
};
