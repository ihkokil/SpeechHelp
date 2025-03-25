
import React from 'react';
import Translate from '@/components/Translate';

interface SpeechDetailsConfirmationProps {
  speechDetails?: Record<string, string>;
}

const SpeechDetailsConfirmation: React.FC<SpeechDetailsConfirmationProps> = ({
  speechDetails
}) => {
  if (!speechDetails || Object.keys(speechDetails).length === 0) {
    return <div className="mt-4"><p>No speech details provided.</p></div>;
  }

  // We'll exclude the introduction question from the display
  // since it's just used for flow control
  const detailsToShow = Object.entries(speechDetails || {}).filter(
    ([key]) => key !== "Will you be introduced before you speak?"
  );

  return (
    <div className="mt-4">
      <p className="mb-2"><Translate text="speechLab.confirmDetails" /></p>
      <ul className="space-y-1 list-disc pl-5">
        {detailsToShow.map(([key, value]) => (
          <li key={key} className="text-sm">
            <span className="font-medium">{key}:</span> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpeechDetailsConfirmation;
