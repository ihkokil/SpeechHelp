
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
    <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'}`}>
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
