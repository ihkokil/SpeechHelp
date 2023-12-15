
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
  const isMobile = useIsMobile();
  
  const formatDate = (dateString: string) => {
    // Ensure we're parsing the ISO string correctly before formatting
    const date = parseISO(dateString);
    return format(date, isMobile ? 'MM/dd/yy' : 'MMM d, yyyy h:mm a');
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><Translate text="common.title" /></TableHead>
            <TableHead className="text-center hidden sm:table-cell"><Translate text="common.type" /></TableHead>
            <TableHead className="hidden md:table-cell"><Translate text="dashboard.created" /></TableHead>
            <TableHead className="hidden lg:table-cell"><Translate text="dashboard.lastUpdated" /></TableHead>
            <TableHead className="text-right"><Translate text="common.actions" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {speeches.map((speech) => (
            <TableRow key={speech.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">{speech.title}</span>
                  <span className="sm:hidden">
                    <Badge 
                      className={`${getTypeColor(speech.speech_type)} text-xs mt-1 inline-flex justify-center w-full max-w-[120px]`}
                      title={getSpeechTypeLabel(speech.speech_type)}
                    >
                      {getSpeechTypeLabel(speech.speech_type)}
                    </Badge>
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center hidden sm:table-cell">
                <Badge 
                  className={`${getTypeColor(speech.speech_type)} mx-auto inline-flex justify-center w-28 h-6 px-2 whitespace-nowrap overflow-hidden text-ellipsis`}
                  title={getSpeechTypeLabel(speech.speech_type)}
                >
                  {getSpeechTypeLabel(speech.speech_type)}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm">{formatDate(speech.created_at)}</TableCell>
              <TableCell className="hidden lg:table-cell text-sm">{formatDate(speech.updated_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1 md:gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => onView(speech)}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(speech)}
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-8 w-8"
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
