
import React from 'react';
import { QuestionItem } from '@/components/speech/questionnaires/types';
import TextQuestion from './TextQuestion';
import TextareaQuestion from './TextareaQuestion';
import RadioQuestion from './RadioQuestion';

export interface QuestionRendererProps {
  questionData: QuestionItem;
  value: string;
  onChange: (value: string) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ 
  questionData, 
  value, 
  onChange 
}) => {
  const { question, type, options, placeholder } = questionData;

  // Render the appropriate question type
  switch (type) {
    case 'text':
      return (
        <TextQuestion 
          question={question}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      );
    case 'textarea':
      return (
        <TextareaQuestion 
          question={question}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      );
    case 'radio':
      if (!options || options.length === 0) {
        return null; // Don't render a radio question without options
      }
      return (
        <RadioQuestion 
          question={question}
          options={options}
          value={value}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
};

export default QuestionRenderer;
