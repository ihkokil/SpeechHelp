
import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Speech } from '@/types/speech';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getSpeechTypeLabel, getTypeColor } from './speech-utils';

interface SpeechesTableProps {
  speeches: Speech[];
  onView: (speech: Speech) => void;
  onEdit: (speech: Speech) => void;
  onDelete: (speech: Speech) => void;
}

const SpeechesTable = ({ speeches, onView, onEdit, onDelete }: SpeechesTableProps) => {
  const isMobile = useIsMobile();
  
  // Debug information about speeches
  useEffect(() => {
    console.log(`SpeechesTable rendering with ${speeches.length} speeches`);
    console.log('Speech types breakdown:', 
      speeches.reduce((acc, speech) => {
        const type = speech.isUpcoming ? 'upcoming' : speech.speech_type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    );
  }, [speeches]);
  
  const getFormattedDate = (date: string | null) => {
    if (!date || date === "") {
      return 'N/A';
    }
    
    try {
      // Parse the date string to a Date object
      const parsedDate = new Date(date);
      
      // Check if the date is valid
      if (isNaN(parsedDate.getTime())) {
        return 'N/A';
      }
      
      // Format the date
      const formatted = format(parsedDate, 'MMM d, yyyy');
      return formatted;
    } catch (error) {
      console.error('Error formatting date:', error, 'Date value:', date);
      return 'N/A';
    }
  };

  // Check date fields on initial render
  useEffect(() => {
    if (speeches.length > 0) {
      speeches.forEach((speech, index) => {
        console.log(`Speech ${index} data:`, {
          id: speech.id,
          title: speech.title,
          created_at: speech.created_at,
          updated_at: speech.updated_at,
          created_type: typeof speech.created_at,
          updated_type: typeof speech.updated_at,
          isUpcoming: speech.isUpcoming,
          speech_type: speech.speech_type
        });
      });
    }
  }, [speeches]);

  if (isMobile) {
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
                    <div>Created: {getFormattedDate(speech.created_at)}</div>
                    <div>Modified: {getFormattedDate(speech.updated_at)}</div>
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
  }
  
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
                    <TableCell className="hidden sm:table-cell">{getFormattedDate(speech.created_at)}</TableCell>
                    <TableCell className="hidden md:table-cell">{getFormattedDate(speech.updated_at)}</TableCell>
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

export default SpeechesTable;
