
import { useEffect } from 'react';
import { Speech } from '@/types/speech';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileSpeechTable from './table/MobileSpeechTable';
import DesktopSpeechTable from './table/DesktopSpeechTable';
import { logSpeechDates } from './utils/dateFormatUtils';

interface SpeechesTableProps {
  speeches: Speech[];
  onView: (speech: Speech) => void;
  onEdit: (speech: Speech) => void;
  onDelete: (speech: Speech) => void;
}

const SpeechesTable = ({ speeches = [], onView, onEdit, onDelete }: SpeechesTableProps) => {
  const isMobile = useIsMobile();
  
  // Debug information about speeches
  useEffect(() => {
    console.log(`SpeechesTable rendering with ${speeches?.length || 0} speeches`);
    console.log('Speech types breakdown:', 
      speeches.reduce((acc, speech) => {
        const type = speech.isUpcoming ? 'upcoming' : speech.speech_type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    );
    
    // Log date fields on initial render
    logSpeechDates(speeches, 'SpeechesTable');
  }, [speeches]);

  // Safety check for empty speeches array
  if (!speeches || speeches.length === 0) {
    console.log('SpeechesTable received empty or null speeches array');
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">No speeches found</p>
      </div>
    );
  }

  // Render the appropriate table based on screen size
  if (isMobile) {
    return (
      <MobileSpeechTable 
        speeches={speeches}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }
  
  return (
    <DesktopSpeechTable 
      speeches={speeches}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default SpeechesTable;
