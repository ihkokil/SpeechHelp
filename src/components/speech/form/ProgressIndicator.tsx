
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentQuestionIndex, 
  totalQuestions 
}) => {
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
        <span>{Math.round(progressPercentage)}% complete</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};

export default ProgressIndicator;
