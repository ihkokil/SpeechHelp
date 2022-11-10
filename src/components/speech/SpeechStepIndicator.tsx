
import React from 'react';
import { cn } from '@/lib/utils';

type StepIndicatorProps = {
  currentStep: number;
};

const SpeechStepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const steps = [
    { number: 1, title: 'Generate New Speech' },
    { number: 2, title: 'Select Speech Type' },
    { number: 3, title: 'Provide Details' },
    { number: 4, title: 'Review & Save' }
  ];

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center relative">
        {/* Progress bar */}
        <div className="absolute h-1 bg-slate-200 top-1/2 left-0 right-0 -translate-y-1/2 z-0" />
        <div 
          className="absolute h-1 bg-purple-600 top-1/2 left-0 -translate-y-1/2 z-10 transition-all duration-500 ease-in-out" 
          style={{ width: `${Math.max(0, (currentStep - 1) / (steps.length - 1) * 100)}%` }}
        />
        
        {/* Step circles */}
        {steps.map((step) => (
          <div key={step.number} className="z-20 flex flex-col items-center gap-2">
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                currentStep === step.number 
                  ? "bg-purple-600 text-white border-2 border-purple-600" 
                  : currentStep > step.number
                    ? "bg-purple-600 text-white"
                    : "bg-white text-slate-400 border-2 border-slate-300"
              )}
            >
              {step.number}
            </div>
            <span 
              className={cn(
                "text-xs font-medium whitespace-nowrap",
                currentStep === step.number 
                  ? "text-purple-600" 
                  : currentStep > step.number
                    ? "text-slate-700"
                    : "text-slate-400"
              )}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeechStepIndicator;
