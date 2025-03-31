
import React from 'react';
import SpeechOccasionCard from './SpeechOccasionCard';
import { SpeechType } from '../data/speechTypesData';
import { useIsMobile } from '@/hooks/use-mobile';

interface SpeechOccasionGridProps {
  speechTypes: SpeechType[];
  selectedSpeechType: string;
  setSelectedSpeechType: (type: string) => void;
}

const SpeechOccasionGrid: React.FC<SpeechOccasionGridProps> = ({
  speechTypes,
  selectedSpeechType,
  setSelectedSpeechType
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="mobile-card-grid w-full">
      {speechTypes.map((type) => (
        <SpeechOccasionCard 
          key={type.id}
          speechType={type}
          isSelected={selectedSpeechType === type.id}
          onSelect={setSelectedSpeechType}
        />
      ))}
    </div>
  );
};

export default SpeechOccasionGrid;
