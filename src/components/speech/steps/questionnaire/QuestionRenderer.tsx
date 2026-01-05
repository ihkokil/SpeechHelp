
import React from 'react';
import { QuestionItem } from '../../questionnaires';
import TextQuestion from './TextQuestion';
import TextareaQuestion from './TextareaQuestion';
import RadioQuestion from './RadioQuestion';
import SelectQuestion from './SelectQuestion';

interface QuestionRendererProps {
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
      return (
        <RadioQuestion 
          question={question}
          value={value}
          onChange={onChange}
          options={options || []}
        />
      );
    case 'select':
      return (
        <SelectQuestion 
          question={question}
          value={value}
          onChange={onChange}
          options={options || []}
          placeholder={placeholder}
        />
      );
    default:
      return null;
  }
};

export default QuestionRenderer;
