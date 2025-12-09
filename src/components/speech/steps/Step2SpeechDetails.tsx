
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
  onStartOver: () => void;
}

const Step2SpeechDetails: React.FC<Step2Props> = ({ 
  nextStep, 
  prevStep, 
  selectedSpeechType,
  onDetailsChange,
  onStartOver
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get questionnaire based on speech type
  const getQuestionnaire = useCallback(() => {
    const questionnaire = questionnaires[selectedSpeechType] || questionnaires.other;
    console.log(`Got ${questionnaire.length} questions for speech type: ${selectedSpeechType}`);
    return questionnaire;
  }, [selectedSpeechType]);

  // Filter questions based on conditions
  const updateFilteredQuestions = useCallback(() => {
    try {
      const allQuestions = getQuestionnaire();
      
      console.log('Filtering questions with formData:', formData);
      
      // Use a Map to track questions by ID and prevent duplicates
      const questionMap = new Map<string, QuestionItem>();
      
      // First add all questions without conditions (basic questions)
      allQuestions.filter(question => !question.condition)
        .forEach(question => {
          questionMap.set(question.question, question);
        });
      
      // Then add conditional questions if they match their conditions
      allQuestions.forEach(question => {
        if (question.condition) {
          const { condition } = question;
          const conditionValue = formData[condition.question];
          
          if (conditionValue === condition.value) {
            // Only add if not already present
            if (!questionMap.has(question.question)) {
              questionMap.set(question.question, question);
            }
          } else {
            // If the condition is not met, and this question is in the map, remove it
            if (questionMap.has(question.question)) {
              questionMap.delete(question.question);
            }
          }
        }
      });
      
      // Convert map back to array and sort to maintain original order
      const sortedQuestions = Array.from(questionMap.values())
        .sort((a, b) => {
          return allQuestions.findIndex(q => q.question === a.question) - 
                 allQuestions.findIndex(q => q.question === b.question);
        });
      
      console.log('Filtered questions count:', sortedQuestions.length);
      console.log('Filtered questions:', sortedQuestions.map(q => q.question));
      setFilteredQuestions(sortedQuestions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error updating filtered questions:', error);
      setIsLoading(false);
    }
  }, [formData, getQuestionnaire]);

  // Initialize questions on first load
  useEffect(() => {
    try {
      const initialQuestions = getQuestionnaire().filter(q => !q.condition);
      console.log('Initial questions on load:', initialQuestions.length);
      setFilteredQuestions(initialQuestions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading initial questions:', error);
      setIsLoading(false);
    }
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
            onStartOver={onStartOver}
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
