
import React from 'react';
import LanguageSelector from '@/components/common/LanguageSelector';
import Translate from '@/components/Translate';
import { useIsMobile } from '@/hooks/use-mobile';

const SpeechLabHeader: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex flex-col md:flex-row md:justify-between md:items-center mb-3 md:mb-8 ${isMobile ? 'space-y-2' : ''}`}>
      <div>
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">
          <Translate text="speechLab.title" />
        </h1>
        <p className="mt-1 md:mt-2 text-xs md:text-base text-gray-600">
          <Translate text="speechLab.subtitle" />
        </p>
      </div>
      <div className={`${isMobile ? 'self-start' : ''}`}>
        <LanguageSelector />
      </div>
    </div>
  );
};

export default SpeechLabHeader;
