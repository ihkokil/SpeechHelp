
import React from 'react';
import Translate from '@/components/Translate';

interface SpeechDetailsConfirmationProps {
  speechDetails?: Record<string, string>;
}

const SpeechDetailsConfirmation: React.FC<SpeechDetailsConfirmationProps> = ({
  speechDetails
}) => {
  return (
    <div className="mt-4">
      <p className="mb-2"><Translate text="speechLab.confirmDetails" /></p>
      <ul className="space-y-1 list-disc pl-5">
        {Object.entries(speechDetails || {}).map(([key, value]) => (
          <li key={key} className="text-sm">
            <span className="font-medium">{key}:</span> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpeechDetailsConfirmation;
