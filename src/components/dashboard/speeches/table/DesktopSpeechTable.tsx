
import { useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Speech } from '@/types/speech';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getSpeechTypeLabel, getTypeColor } from '../speech-utils';
import { formatSpeechDate } from '../utils/dateFormatUtils';

interface DesktopSpeechTableProps {
  speeches: Speech[];
  onView: (speech: Speech) => void;
  onEdit: (speech: Speech) => void;
  onDelete: (speech: Speech) => void;
}

const DesktopSpeechTable = ({ speeches, onView, onEdit, onDelete }: DesktopSpeechTableProps) => {
  // Debug information about speeches
  useEffect(() => {
    console.log(`DesktopSpeechTable rendering with ${speeches.length} speeches`);
  }, [speeches]);

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden sm:table-cell">Created</TableHead>
              <TableHead className="hidden md:table-cell">Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {speeches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-gray-500">No speeches found</p>
                </TableCell>
              </TableRow>
            ) : (
              speeches.map((speech) => {
                return (
                  <TableRow key={speech.id}>
                    <TableCell className="font-medium break-words max-w-[200px]">
                      {speech.title}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(speech.speech_type)}>
                        {getSpeechTypeLabel(speech.speech_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {formatSpeechDate(speech, 'created_at')}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {speech.isUpcoming ? 'Not created yet' : formatSpeechDate(speech, 'updated_at')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onView(speech)}
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                          aria-label="View speech"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEdit(speech)}
                          className="text-gray-500 hover:text-amber-600 transition-colors"
                          aria-label="Edit speech"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(speech)}
                          className="text-gray-500 hover:text-red-600 transition-colors"
                          aria-label="Delete speech"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DesktopSpeechTable;
