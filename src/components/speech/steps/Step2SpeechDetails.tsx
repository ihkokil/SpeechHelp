
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';
import { getSpeechTypeLabel } from '@/components/dashboard/speeches/speech-utils';
import { getQuestionnaire } from '../utils/speechUtils';
import ProgressIndicator from '../form/ProgressIndicator';
import QuestionnaireForm from '../form/QuestionnaireForm';

interface Step2Props {
  nextStep: () => void;
  prevStep: () => void;
  selectedSpeechType: string;
  onSpeechDetailsChange?: (details: Record<string, string>) => void;
  speechDetails?: Record<string, string>;
}

const Step2SpeechDetails: React.FC<Step2Props> = ({ 
  nextStep, 
  prevStep, 
  selectedSpeechType,
  onSpeechDetailsChange,
  speechDetails: initialSpeechDetails = {}
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>(initialSpeechDetails);

  // Get questions based on the selected speech type
  const questions = getQuestionnaire(selectedSpeechType);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, proceed to next step
      if (onSpeechDetailsChange) {
        onSpeechDetailsChange(formData);
      }
      nextStep();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // Go back to previous step
      prevStep();
    }
  };

  const handleInputChange = (value: string) => {
    const updatedFormData = {
      ...formData,
      [questions[currentQuestionIndex].question]: value
    };
    setFormData(updatedFormData);
    
    // Update parent component with each change
    if (onSpeechDetailsChange) {
      onSpeechDetailsChange(updatedFormData);
    }
  };

  // Current question data
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getSpeechTypeLabel(selectedSpeechType)} <Translate text="speechLab.detailsTitle" /></CardTitle>
        <CardDescription><Translate text="speechLab.detailsDesc" /></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress bar */}
        <ProgressIndicator 
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
        />
        
        {/* Current question */}
        <QuestionnaireForm
          question={currentQuestion}
          value={formData[currentQuestion.question] || ''}
          onInputChange={handleInputChange}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
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
      </CardFooter>
    </Card>
  );
};

export default Step2SpeechDetails;
