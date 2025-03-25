
import React from 'react';
import { Separator } from '@/components/ui/separator';
import Translate from '@/components/Translate';
import { SpeechDetails } from '../hooks/useSpeechLabState';
import { SpeechType } from '../data/speechTypesData';

interface SpeechDetailsSummaryProps {
  selectedSpeechType: string;
  speechTypes: SpeechType[];
  speechDetails?: SpeechDetails;
}

const SpeechDetailsSummary: React.FC<SpeechDetailsSummaryProps> = ({
  selectedSpeechType,
  speechTypes,
  speechDetails = {}
}) => {
  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h3 className="font-medium mb-2">
        <Translate text="common.type" />: {speechTypes.find(type => type.id === selectedSpeechType)?.label || ''}
      </h3>
      <Separator className="my-4" />
      <div className="text-sm text-gray-600">
        {Object.keys(speechDetails || {}).length > 0 ? (
          <div>
            <p className="font-medium mb-2">
              <Translate text="speechLab.detailsSummary" fallback="Your speech details:" />
            </p>
            <ul className="list-disc pl-4 space-y-1 max-h-40 overflow-y-auto">
              {Object.entries(speechDetails || {}).slice(0, 3).map(([question, answer], index) => (
                <li key={index}>
                  <span className="font-medium">{question.split('?')[0]}?</span> {answer.length > 50 ? `${answer.substring(0, 50)}...` : answer}
                </li>
              ))}
              {Object.keys(speechDetails || {}).length > 3 && (
                <li className="font-medium text-pink-600">+ {Object.keys(speechDetails || {}).length - 3} more details</li>
              )}
            </ul>
          </div>
        ) : (
          <p><Translate text="speechLab.summaryNotice" fallback="Speech details will be used to generate your content" /></p>
        )}
      </div>
    </div>
  );
};

export default SpeechDetailsSummary;
