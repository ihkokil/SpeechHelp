
import { QuestionItem } from './types';

// Introduction question to add to all questionnaires
export const introductionQuestion: QuestionItem = { 
  question: "Will you be introduced before you speak?", 
  type: "radio" as const, 
  options: ["Yes", "No", "Unsure"]
};

// Additional common questions that can be reused across questionnaires
export const emotionalImpactQuestion: QuestionItem = {
  question: "What emotional impact do you want to have on your audience?",
  type: "radio" as const,
  options: ["Inspire", "Move emotionally", "Amuse", "Motivate to action", "Create reflection"]
};

export const humorLevelQuestion: QuestionItem = {
  question: "How much humor would you like in your speech?",
  type: "radio" as const,
  options: ["None", "Subtle/Light", "Moderate", "Significant"]
};

export const speechStructureQuestion: QuestionItem = {
  question: "What speech structure do you prefer?",
  type: "radio" as const,
  options: ["Chronological", "Thematic", "Problem-Solution", "Story-based", "Standard (intro, body, conclusion)"]
};

export const languageStyleQuestion: QuestionItem = {
  question: "What style of language would you prefer?",
  type: "radio" as const,
  options: ["Simple and accessible", "Moderate", "Sophisticated", "Poetic/Figurative"]
};

export const culturalElementsQuestion: QuestionItem = {
  question: "Would you like to include cultural or traditional elements?",
  type: "radio" as const,
  options: ["Yes", "No"]
};

export const culturalDetailsQuestion: QuestionItem = {
  question: "Please describe the cultural or traditional elements",
  type: "textarea",
  placeholder: "E.g., specific traditions, cultural references, or customs to include",
  condition: { question: "Would you like to include cultural or traditional elements?", value: "Yes" }
};
