
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Speech } from '@/types/speech';
import { getSpeechTypeLabel, getSpeechTypeColor, formatSpeechDate } from '../speech-utils';

interface DesktopSpeechTableProps {
  speeches: Speech[];
  onView: (speech: Speech) => void;
  onEdit: (speech: Speech) => void;
  onDelete: (speech: Speech) => void;
}

const DesktopSpeechTable = ({ speeches, onView, onEdit, onDelete }: DesktopSpeechTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {speeches.map((speech) => (
            <TableRow key={speech.id}>
              <TableCell className="font-medium">{speech.title}</TableCell>
              <TableCell>
                <Badge 
                  variant="speech"
                  className={getSpeechTypeColor(speech.speech_type)}
                >
                  {getSpeechTypeLabel(speech.speech_type)}
                </Badge>
              </TableCell>
              <TableCell>{formatSpeechDate(speech.created_at)}</TableCell>
              <TableCell>{formatSpeechDate(speech.updated_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(speech)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(speech)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(speech)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DesktopSpeechTable;
