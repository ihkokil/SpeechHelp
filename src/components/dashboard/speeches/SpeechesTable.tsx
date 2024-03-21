
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
  
  const getFormattedDate = (date: string | null) => {
    if (!date || date === "") {
      console.log('Empty date received:', date);
      return 'N/A';
    }
    
    try {
      // Parse the date string to a Date object
      console.log('Attempting to format date:', date);
      const parsedDate = new Date(date);
      
      // Check if the date is valid
      if (isNaN(parsedDate.getTime())) {
        console.error('Invalid date format:', date);
        return 'N/A';
      }
      
      // Format the date
      const formatted = format(parsedDate, 'MMM d, yyyy');
      console.log('Successfully formatted date:', date, 'to', formatted);
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
          updated_type: typeof speech.updated_at
        });
      });
    }
  }, [speeches]);

  if (isMobile) {
    return (
      <div className="space-y-4 pb-4">
        {speeches.map((speech) => (
          <div 
            key={speech.id} 
            className="bg-white rounded-lg border p-4 shadow-sm"
          >
            <h3 className="font-medium text-base break-words">{speech.title}</h3>
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-gray-500">
                <Badge className={getTypeColor(speech.speech_type)}>
                  {getSpeechTypeLabel(speech.speech_type)}
                </Badge>
                <div className="mt-2">
                  <div>Created: {getFormattedDate(speech.created_at)}</div>
                  <div>Modified: {getFormattedDate(speech.updated_at)}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onView(speech)}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEdit(speech)}
                  className="p-2 text-gray-500 hover:text-amber-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(speech)}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {speeches.map((speech) => {
            return (
              <TableRow key={speech.id}>
                <TableCell className="font-medium break-words">
                  {speech.title}
                </TableCell>
                <TableCell>
                  <Badge className={getTypeColor(speech.speech_type)}>
                    {getSpeechTypeLabel(speech.speech_type)}
                  </Badge>
                </TableCell>
                <TableCell>{getFormattedDate(speech.created_at)}</TableCell>
                <TableCell>{getFormattedDate(speech.updated_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onView(speech)}
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(speech)}
                      className="text-gray-500 hover:text-amber-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(speech)}
                      className="text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default SpeechesTable;
