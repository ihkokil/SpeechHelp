
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { ButtonCustom } from '@/components/ui/button-custom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { QuestionItem } from '../../questionnaires';
import QuestionRenderer from './QuestionRenderer';
import Translate from '@/components/Translate';
import { useTranslation } from '@/translations';
import EncouragementMessage from '../../components/EncouragementMessage';

interface SpeechQuestionnaireProps {
  questions: QuestionItem[];
  formData: Record<string, string>;
  onFormDataChange: (data: Record<string, string>) => void;
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
  const { t } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Update progress when moving through questions
  useEffect(() => {
    setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
  }, [currentQuestionIndex, questions.length]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, proceed to next step
      onNext();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // Go back to previous step
      onPrev();
    }
  };

  const handleInputChange = (value: string) => {
    const updatedFormData = {
      ...formData,
      [questions[currentQuestionIndex].question]: value
    };
    
    onFormDataChange(updatedFormData);
  };

  // Current question data
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-6 relative">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Current question */}
      <div className="space-y-4">
        <QuestionRenderer 
          questionData={currentQuestion}
          value={formData[currentQuestion.question] || ''}
          onChange={handleInputChange}
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <ButtonCustom onClick={handlePrevQuestion} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <Translate text="speechLab.backButton" />
        </ButtonCustom>
        <ButtonCustom onClick={handleNextQuestion} variant="magenta">
          {currentQuestionIndex < questions.length - 1 ? (
            <>
              <Translate text="speechLab.nextQuestion" fallback="Next Question" />
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              <Translate text="speechLab.nextButton" />
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </ButtonCustom>
      </div>

      {/* Encouraging message component - positioned below the questionnaire */}
      <div className="mt-8 pt-6">
        <EncouragementMessage 
          currentQuestionIndex={currentQuestionIndex} 
          totalQuestions={questions.length} 
        />
      </div>
    </div>
  );
};

export default SpeechQuestionnaire;
