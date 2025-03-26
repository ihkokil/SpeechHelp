
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';
import { getSpeechTypeLabel } from '@/components/dashboard/speeches/speech-utils';
import { questionnaires, QuestionItem } from '../questionnaires';
import SpeechQuestionnaire from './questionnaire/SpeechQuestionnaire';

interface Step2Props {
  nextStep: () => void;
  prevStep: () => void;
  selectedSpeechType: string;
  onDetailsChange: (details: Record<string, string>) => void;
}

const Step2SpeechDetails: React.FC<Step2Props> = ({ 
  nextStep, 
  prevStep, 
  selectedSpeechType,
  onDetailsChange 
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get questionnaire based on speech type
  const getQuestionnaire = useCallback(() => {
    return questionnaires[selectedSpeechType] || questionnaires.other;
  }, [selectedSpeechType]);

  // Filter questions based on conditions
  const updateFilteredQuestions = useCallback(() => {
    try {
      const allQuestions = getQuestionnaire();
      
      console.log('Filtering questions with formData:', formData);
      
      // First add all questions without conditions
      let newFilteredQuestions = allQuestions.filter(question => {
        return !question.condition;
      });
      
      // Then add questions that match their conditions
      allQuestions.forEach(question => {
        if (question.condition) {
          const { condition } = question;
          const conditionValue = formData[condition.question];
          
          if (conditionValue === condition.value) {
            // Only add if not already in the filtered list
            if (!newFilteredQuestions.some(q => q.question === question.question)) {
              newFilteredQuestions.push(question);
            }
          }
        }
      });
      
      // Sort the questions to maintain the same order as in the original array
      newFilteredQuestions.sort((a, b) => {
        return allQuestions.findIndex(q => q.question === a.question) - 
               allQuestions.findIndex(q => q.question === b.question);
      });
      
      console.log('Filtered questions:', newFilteredQuestions);
      setFilteredQuestions(newFilteredQuestions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error updating filtered questions:', error);
      setIsLoading(false);
    }
  }, [formData, getQuestionnaire]);

  // Initialize questions on first load
  useEffect(() => {
    const initialQuestions = getQuestionnaire().filter(q => !q.condition);
    setFilteredQuestions(initialQuestions);
    setIsLoading(false);
  }, [getQuestionnaire]);

  // Update filtered questions when form data changes
  useEffect(() => {
    updateFilteredQuestions();
  }, [formData, updateFilteredQuestions]);

  // Handle form data changes
  const handleFormDataChange = useCallback((newFormData: Record<string, string>) => {
    console.log('Form data changed:', newFormData);
    setFormData(newFormData);
    onDetailsChange(newFormData);
  }, [onDetailsChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getSpeechTypeLabel(selectedSpeechType)} <Translate text="speechLab.detailsTitle" /></CardTitle>
        <CardDescription><Translate text="speechLab.detailsDesc" /></CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <p>Loading questions...</p>
          </div>
        ) : filteredQuestions.length > 0 ? (
          <SpeechQuestionnaire
            questions={filteredQuestions}
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onNext={nextStep}
            onPrev={prevStep}
          />
        ) : (
          <div className="flex justify-center items-center p-8">
            <p>No questions available for this speech type.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Step2SpeechDetails;
