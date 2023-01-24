
import { Speech } from '@/contexts/AuthContext';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EditIcon, Trash2Icon, EyeIcon } from 'lucide-react';
import { format } from 'date-fns';
import { getSpeechTypeLabel, getTypeColor } from './speech-utils';
import Translate from '@/components/Translate';

interface SpeechesFilteredTableProps {
  speeches: Speech[];
  onView: (speech: Speech) => void;
  onEdit: (speech: Speech) => void;
  onDelete: (speech: Speech) => void;
}

const SpeechesFilteredTable = ({ speeches, onView, onEdit, onDelete }: SpeechesFilteredTableProps) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><Translate text="common.title" /></TableHead>
            <TableHead><Translate text="common.type" /></TableHead>
            <TableHead><Translate text="dashboard.created" /></TableHead>
            <TableHead><Translate text="dashboard.lastUpdated" /></TableHead>
            <TableHead className="text-right"><Translate text="common.actions" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {speeches.map((speech) => (
            <TableRow key={speech.id}>
              <TableCell className="font-medium max-w-[200px] truncate">{speech.title}</TableCell>
              <TableCell>
                <Badge className={getTypeColor(speech.speech_type)}>
                  {getSpeechTypeLabel(speech.speech_type)}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(speech.created_at)}</TableCell>
              <TableCell>{formatDate(speech.updated_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onView(speech)}
                    title="View Speech"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(speech)}
                    title="Edit Speech"
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onDelete(speech)}
                    title="Delete Speech"
                  >
                    <Trash2Icon className="h-4 w-4" />
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

export default SpeechesFilteredTable;
