
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Speech } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EditIcon, Trash2Icon, EyeIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { getSpeechTypeLabel, getTypeColor } from './speech-utils';
import Translate from '@/components/Translate';

interface SpeechesTableProps {
  speeches: Speech[];
  onView: (speech: Speech) => void;
  onEdit: (speech: Speech) => void;
  onDelete: (speech: Speech) => void;
}

const SpeechesTable = ({ speeches, onView, onEdit, onDelete }: SpeechesTableProps) => {
  const formatDate = (dateString: string) => {
    // Ensure we're parsing the ISO string correctly before formatting
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead><Translate text="common.title" /></TableHead>
          <TableHead className="text-center hidden md:table-cell"><Translate text="common.type" /></TableHead>
          <TableHead className="hidden md:table-cell"><Translate text="dashboard.created" /></TableHead>
          <TableHead className="hidden md:table-cell"><Translate text="dashboard.modified" /></TableHead>
          <TableHead className="text-right"><Translate text="common.actions" /></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {speeches.map((speech) => (
          <TableRow key={speech.id}>
            <TableCell className="font-medium max-w-[200px] truncate">
              {speech.title}
              <div className="md:hidden mt-1">
                <Badge 
                  className={`${getTypeColor(speech.speech_type)} inline-flex justify-center h-6 px-2 whitespace-nowrap overflow-hidden text-ellipsis`}
                  title={getSpeechTypeLabel(speech.speech_type)}
                >
                  {getSpeechTypeLabel(speech.speech_type)}
                </Badge>
              </div>
            </TableCell>
            <TableCell className="text-center hidden md:table-cell">
              <Badge 
                className={`${getTypeColor(speech.speech_type)} mx-auto inline-flex justify-center w-32 h-6 px-2 whitespace-nowrap overflow-hidden text-ellipsis`}
                title={getSpeechTypeLabel(speech.speech_type)}
              >
                {getSpeechTypeLabel(speech.speech_type)}
              </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">{formatDate(speech.created_at)}</TableCell>
            <TableCell className="hidden md:table-cell">{formatDate(speech.updated_at)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onView(speech)}
                  className="p-2"
                >
                  <EyeIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onEdit(speech)}
                  className="p-2"
                >
                  <EditIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onDelete(speech)}
                  className="p-2"
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SpeechesTable;
