
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
  const [showEncouragement, setShowEncouragement] = useState(false);

  // Safeguard against invalid question index
  useEffect(() => {
    if (currentQuestionIndex >= questions.length) {
      setCurrentQuestionIndex(questions.length - 1);
    }
  }, [currentQuestionIndex, questions.length]);

  // Update progress when moving through questions
  useEffect(() => {
    if (questions.length > 0) {
      setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
      
      // Show encouragement message every 2nd or 3rd question (randomly)
      const shouldShowEncouragement = Math.random() > 0.5 ? 
        currentQuestionIndex % 2 === 0 : 
        currentQuestionIndex % 3 === 0;
      
      setShowEncouragement(shouldShowEncouragement);
    }
  }, [currentQuestionIndex, questions.length]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onNext();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      onPrev();
    }
  };

  const handleInputChange = (value: string) => {
    if (!questions[currentQuestionIndex]) {
      console.error('Current question is undefined');
      return;
    }

    const updatedFormData = {
      ...formData,
      [questions[currentQuestionIndex].question]: value
    };
    
    onFormDataChange(updatedFormData);
  };

  // Current question data with safeguard
  const currentQuestion = questions[currentQuestionIndex];
  
  if (!currentQuestion || questions.length === 0) {
    console.error('No questions available or current question is undefined');
    return <div>Loading questions...</div>;
  }

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

      {/* Encouraging message component */}
      {showEncouragement && (
        <div className="mt-8 pt-6">
          <EncouragementMessage 
            currentQuestionIndex={currentQuestionIndex} 
            totalQuestions={questions.length} 
          />
        </div>
      )}
    </div>
  );
};

export default SpeechQuestionnaire;
