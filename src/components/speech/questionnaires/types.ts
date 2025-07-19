
// Define types for questionnaire items
export type QuestionType = 'text' | 'textarea' | 'radio';

export type QuestionItem = {
  question: string;
  type: QuestionType;
  options?: string[];
  placeholder?: string;
  condition?: { 
    question: string; 
    value: string;
  };
};

export type SpeechTypeQuestionnaires = Record<string, QuestionItem[]>;

// Add speech content types
export type SpeechContentFormat = {
  content: string;
  metadata?: Record<string, any>;
};
