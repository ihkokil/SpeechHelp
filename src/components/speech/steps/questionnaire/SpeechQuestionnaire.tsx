
import React, { useState, useCallback } from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { QuestionItem } from '@/components/speech/questionnaires/types';
import QuestionRenderer from './QuestionRenderer';
import Translate from '@/components/Translate';
import { useIsMobile } from '@/hooks/use-mobile';

interface SpeechQuestionnaireProps {
  questions: QuestionItem[];
  formData: Record<string, string>;
  onFormDataChange: (formData: Record<string, string>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SpeechQuestionnaire: React.FC<SpeechQuestionnaireProps> = ({
  questions,
  formData,
  onFormDataChange,
  onNext,
  onPrev
}) => {
  const isMobile = useIsMobile();
  const [currentQuestions, setCurrentQuestions] = useState<Record<string, string>>(formData);

  const handleChange = useCallback((questionKey: string, value: string) => {
    setCurrentQuestions(prev => {
      const updatedQuestions = { ...prev, [questionKey]: value };
      return updatedQuestions;
    });
  }, []);

  const handleContinue = () => {
    onFormDataChange(currentQuestions);
    onNext();
  };

  // Check if all required questions are answered
  const isFormValid = questions.every(q => 
    !q.required || (currentQuestions[q.question] && currentQuestions[q.question].trim() !== '')
  );

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        {questions.map((question) => (
          <QuestionRenderer
            key={question.question}
            question={question}
            value={currentQuestions[question.question] || ''}
            onChange={(value) => handleChange(question.question, value)}
          />
        ))}
      </div>

      <div className={`${isMobile ? 'flex flex-col space-y-3 pt-2' : 'flex justify-between pt-4'}`}>
        <ButtonCustom 
          onClick={onPrev} 
          variant="outline"
          className={isMobile ? 'w-full' : ''}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <Translate text="speechLab.backButton" />
        </ButtonCustom>
        <ButtonCustom 
          onClick={handleContinue} 
          variant="magenta" 
          disabled={!isFormValid}
          className={isMobile ? 'w-full' : ''}
        >
          <Translate text="speechLab.nextButton" />
          <ArrowRight className="ml-2 h-4 w-4" />
        </ButtonCustom>
      </div>
    </div>
  );
};

export default SpeechQuestionnaire;
