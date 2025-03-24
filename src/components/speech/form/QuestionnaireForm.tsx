
import React from 'react';
import { QuestionnaireItem } from '../data/speechQuestionnaires';
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import RadioInput from './RadioInput';

interface QuestionnaireFormProps {
  question: QuestionnaireItem;
  value: string;
  onInputChange: (value: string) => void;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ 
  question, 
  value, 
  onInputChange 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{question.question}</h3>
      
      {question.type === 'text' && (
        <TextInput 
          value={value || ''}
          onChange={onInputChange}
          placeholder={question.placeholder}
        />
      )}
      
      {question.type === 'textarea' && (
        <TextAreaInput 
          value={value || ''}
          onChange={onInputChange}
          placeholder={question.placeholder}
        />
      )}
      
      {question.type === 'radio' && question.options && (
        <RadioInput 
          value={value || ''}
          onChange={onInputChange}
          options={question.options}
        />
      )}
    </div>
  );
};

export default QuestionnaireForm;
