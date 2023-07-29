
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
import { useIsMobile } from '@/hooks/use-mobile';

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

  const isMobile = useIsMobile();

  // For mobile view, display speeches as cards
  if (isMobile) {
    return (
      <div className="space-y-4 w-full">
        {speeches.map((speech) => (
          <div 
            key={speech.id} 
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="mb-2 font-medium text-gray-900">{speech.title}</div>
            
            <div className="flex justify-between items-center mb-3">
              <Badge 
                className={`${getTypeColor(speech.speech_type)} inline-flex justify-center h-6 px-2 whitespace-nowrap overflow-hidden text-ellipsis`}
                title={getSpeechTypeLabel(speech.speech_type)}
              >
                {getSpeechTypeLabel(speech.speech_type)}
              </Badge>
              
              <div className="text-xs text-gray-500">
                {format(parseISO(speech.updated_at), 'MMM d, yyyy')}
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onView(speech)}
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(speech)}
              >
                <EditIcon className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDelete(speech)}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop view with table
  return (
    <div className="overflow-x-auto w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><Translate text="common.title" /></TableHead>
            <TableHead className="text-center"><Translate text="common.type" /></TableHead>
            <TableHead className="hidden md:table-cell"><Translate text="dashboard.created" /></TableHead>
            <TableHead><Translate text="dashboard.lastUpdated" /></TableHead>
            <TableHead className="text-right"><Translate text="common.actions" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {speeches.map((speech) => (
            <TableRow key={speech.id}>
              <TableCell className="font-medium">{speech.title}</TableCell>
              <TableCell className="text-center">
                <Badge 
                  className={`${getTypeColor(speech.speech_type)} mx-auto inline-flex justify-center w-32 h-6 px-2 whitespace-nowrap overflow-hidden text-ellipsis`}
                  title={getSpeechTypeLabel(speech.speech_type)}
                >
                  {getSpeechTypeLabel(speech.speech_type)}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{formatDate(speech.created_at)}</TableCell>
              <TableCell>{formatDate(speech.updated_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onView(speech)}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(speech)}
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onDelete(speech)}
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

export default SpeechesTable;
