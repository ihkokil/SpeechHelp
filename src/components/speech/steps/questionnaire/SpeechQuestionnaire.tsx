
import React from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import Translate from '@/components/Translate';
import { QuestionItem } from '../../questionnaires';
import QuestionRenderer from './QuestionRenderer';

interface SpeechQuestionnaireProps {
  questions: QuestionItem[];
  formData: Record<string, string>;
  onFormDataChange: (formData: Record<string, string>) => void;
  onNext: () => void;
  onPrev: () => void;
  showStartOverButton?: boolean;
  onStartOver?: () => void;
}

const SpeechQuestionnaire: React.FC<SpeechQuestionnaireProps> = ({
  questions,
  formData,
  onFormDataChange,
  onNext,
  onPrev,
  showStartOverButton = false,
  onStartOver
}) => {
  const handleInputChange = (questionKey: string, value: string) => {
    const newFormData = { ...formData, [questionKey]: value };
    onFormDataChange(newFormData);
  };

  const isFormValid = () => {
    const requiredQuestions = questions.filter(q => q.required !== false);
    return requiredQuestions.every(question => {
      const value = formData[question.question];
      return value && value.trim() !== '';
    });
  };

  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <QuestionRenderer
          key={`${question.question}-${index}`}
          question={question}
          value={formData[question.question] || ''}
          onChange={(value) => handleInputChange(question.question, value)}
        />
      ))}

      <div className="flex flex-col space-y-4 pt-6">
        {/* Desktop layout: Back and Start Over side by side */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <ButtonCustom 
              onClick={onPrev} 
              variant="outline"
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <Translate text="speechLab.backButton" />
            </ButtonCustom>
            
            {showStartOverButton && onStartOver && (
              <ButtonCustom 
                onClick={onStartOver} 
                variant="outline"
                className="w-full sm:w-auto"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Start Over
              </ButtonCustom>
            )}
          </div>
          
          {/* Next button - below on mobile, right side on desktop */}
          <ButtonCustom 
            onClick={onNext} 
            variant="magenta"
            disabled={!isFormValid()}
            className="w-full sm:w-auto"
          >
            <Translate text="speechLab.nextButton" />
            <ArrowRight className="ml-2 h-4 w-4" />
          </ButtonCustom>
        </div>
      </div>
    </div>
  );
};

export default SpeechQuestionnaire;
