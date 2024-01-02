
import React from 'react';
import LanguageSelector from '@/components/common/LanguageSelector';
import Translate from '@/components/Translate';

const SpeechLabHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          <Translate text="speechLab.title" />
        </h1>
        <p className="mt-2 text-gray-600">
          <Translate text="speechLab.subtitle" />
        </p>
      </div>
      <LanguageSelector />
    </div>
  );
};

export default SpeechLabHeader;
