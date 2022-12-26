
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { PartyPopper } from 'lucide-react';
import Translate from '@/components/Translate';

interface SpeechSummaryProps {
  selectedType: {
    id: string;
    label: string;
    image: string;
    icon: React.ReactNode;
  };
  formData: Record<string, string>;
  showConfetti: boolean;
  showCongratulations: boolean;
}

const SpeechSummary: React.FC<SpeechSummaryProps> = ({ 
  selectedType, 
  formData, 
  showConfetti,
  showCongratulations
}) => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-100 rounded-md">
        <h3 className="font-medium mb-2 flex items-center">
          <Translate text="common.type" />: {selectedType.label || ''}
          {selectedType.icon && <span className="ml-2">{selectedType.icon}</span>}
        </h3>
        <Separator className="my-4" />
        <div className="text-sm text-gray-600 space-y-2">
          <p><Translate text="speechLab.summaryNotice" fallback="Speech details will be used to generate your content" /></p>
          
          {Object.keys(formData).length > 0 && (
            <div className="mt-4 p-3 bg-white rounded border border-gray-200">
              <h4 className="font-medium text-sm mb-2">
                <Translate text="speechLab.questionnaireSummary" fallback="Summary of your information:" />
              </h4>
              <ul className="list-disc pl-5 text-xs space-y-1">
                {Object.entries(formData).slice(0, 3).map(([question, answer], idx) => (
                  <li key={idx}>
                    <span className="font-medium">{question}:</span> {answer}
                  </li>
                ))}
                {Object.keys(formData).length > 3 && (
                  <li className="italic">
                    <Translate 
                      text="speechLab.andMoreDetails" 
                      fallback="And more details that will be included in your speech..." 
                    />
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {showConfetti && !showCongratulations && (
        <div className="bg-purple-100 p-4 rounded-md border border-purple-200 text-center">
          <PartyPopper className="h-12 w-12 text-purple-600 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-purple-800 mb-1">
            <Translate text="speechLab.congratulations" fallback="Congratulations!" />
          </h3>
          <p className="text-purple-700">
            <Translate 
              text="speechLab.speechGenerated" 
              fallback="Your speech has been successfully generated! Moving to edit screen..." 
            />
          </p>
        </div>
      )}
    </div>
  );
};

export default SpeechSummary;
