
import React from 'react';
import { Question } from '../questionnaires/types';
import { SpeechDetails } from '../hooks/useSpeechLabState';
import TextQuestion from '../steps/questionnaire/TextQuestion';
import TextareaQuestion from '../steps/questionnaire/TextareaQuestion';
import RadioQuestion from '../steps/questionnaire/RadioQuestion';

interface DynamicFormComponentProps {
  questions: Question[];
  formData: SpeechDetails;
  onFormDataChange: (newData: SpeechDetails) => void;
}

const DynamicFormComponent: React.FC<DynamicFormComponentProps> = ({
  questions,
  formData,
  onFormDataChange
}) => {
  const handleChange = (questionText: string, value: string) => {
    console.log('Form data changed:', { ...formData, [questionText]: value });
    onFormDataChange({ ...formData, [questionText]: value });
  };

  return (
    <div className="space-y-6">
      {questions.map((question, index) => {
        const key = `${question.text}-${index}`;
        
        switch (question.type) {
          case 'text':
            return (
              <TextQuestion
                key={key}
                question={question}
                value={formData[question.text] || ''}
                onChange={(value) => handleChange(question.text, value)}
              />
            );
          case 'textarea':
            return (
              <TextareaQuestion
                key={key}
                question={question}
                value={formData[question.text] || ''}
                onChange={(value) => handleChange(question.text, value)}
              />
            );
          case 'radio':
            return (
              <RadioQuestion
                key={key}
                question={question}
                value={formData[question.text] || ''}
                onChange={(value) => handleChange(question.text, value)}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default DynamicFormComponent;
