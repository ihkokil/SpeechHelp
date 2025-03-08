
import { Speech } from '@/types/speech';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getSpeechTypeLabel, getTypeColor } from '../speech-utils';
import { formatSpeechDate } from '../utils/dateFormatUtils';
import { useEffect } from 'react';

interface MobileSpeechTableProps {
  speeches: Speech[];
  onView: (speech: Speech) => void;
  onEdit: (speech: Speech) => void;
  onDelete: (speech: Speech) => void;
}

const MobileSpeechTable = ({ speeches, onView, onEdit, onDelete }: MobileSpeechTableProps) => {
  // Debug information about speeches
  useEffect(() => {
    console.log(`MobileSpeechTable rendering with ${speeches.length} speeches`);
  }, [speeches]);

  return (
    <div className="space-y-4 pb-4">
      {speeches.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No speeches found</p>
        </div>
      ) : (
        speeches.map((speech) => (
          <div 
            key={speech.id} 
            className="bg-white rounded-lg border p-4 shadow-sm"
          >
            <h3 className="font-medium text-base break-words">{speech.title}</h3>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-2">
              <div className="text-sm text-gray-500">
                <Badge className={getTypeColor(speech.speech_type)}>
                  {getSpeechTypeLabel(speech.speech_type)}
                </Badge>
                <div className="mt-2">
                  <div>{formatSpeechDate(speech, 'created_at')}</div>
                  <div>{speech.isUpcoming ? '' : `Modified: ${formatSpeechDate(speech, 'updated_at')}`}</div>
                </div>
              </div>
              <div className="flex space-x-2 mt-2 sm:mt-0">
                <button
                  onClick={() => onView(speech)}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  aria-label="View speech"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEdit(speech)}
                  className="p-2 text-gray-500 hover:text-amber-600 transition-colors"
                  aria-label="Edit speech"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(speech)}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  aria-label="Delete speech"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MobileSpeechTable;
