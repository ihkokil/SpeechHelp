
import React from 'react';
import { Check } from 'lucide-react';
import { SpeechType } from '../data/speechTypesData';
import { useIsMobile } from '@/hooks/use-mobile';

interface SpeechOccasionCardProps {
  speechType: SpeechType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const SpeechOccasionCard: React.FC<SpeechOccasionCardProps> = ({
  speechType,
  isSelected,
  onSelect
}) => {
  const { id, label, description, image, icon } = speechType;
  const isMobile = useIsMobile();

  return (
    <div 
      onClick={() => onSelect(id)}
      className={`group relative rounded-md overflow-hidden cursor-pointer transition-all duration-300 ${
        isMobile ? 'h-24' : 'h-48'
      } ${
        isSelected ? 'ring-2 ring-pink-500' : 'hover:shadow-lg'
      }`}
    >
      <img 
        src={image} 
        alt={label} 
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-70"></div>
      <div className={`absolute top-2 right-2 rounded-full p-1 text-white ${
        isSelected ? 'bg-pink-600' : 'bg-purple-600'
      }`}>
        {isMobile ? 
          <div className="w-3 h-3">
            {React.cloneElement(icon as React.ReactElement, { size: 12 })}
          </div> : 
          icon
        }
      </div>
      {isSelected && (
        <div className={`absolute ${isMobile ? 'top-2 left-2' : 'top-3 left-3'} bg-pink-600 rounded-full p-1 text-white`}>
          <Check className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
        </div>
      )}
      <div className="absolute bottom-0 left-0 p-2">
        <h3 className={`text-white ${isMobile ? 'text-xs' : 'text-sm'} font-medium truncate max-w-full`}>{label}</h3>
        {description && !isMobile && (
          <p className="text-white/70 text-xs mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

export default SpeechOccasionCard;
