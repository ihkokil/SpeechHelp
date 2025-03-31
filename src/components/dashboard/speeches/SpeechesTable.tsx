
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
    return format(date, isMobile ? 'MM/dd/yy' : 'MMM d, yyyy');
  };

  const formatTime = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'h:mm a');
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[45%]"><Translate text="common.title" /></TableHead>
            <TableHead className="w-[15%] text-center"><Translate text="common.type" /></TableHead>
            <TableHead className="w-[12%] hidden md:table-cell"><Translate text="dashboard.created" /></TableHead>
            <TableHead className="w-[12%] hidden md:table-cell"><Translate text="dashboard.lastUpdated" /></TableHead>
            <TableHead className="w-[16%] text-right"><Translate text="common.actions" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {speeches.map((speech) => (
            <TableRow key={speech.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="truncate">{speech.title}</span>
                  <span className="md:hidden mt-1">
                    <Badge 
                      className={`${getTypeColor(speech.speech_type)} text-xs max-w-20 inline-flex justify-center`}
                    >
                      <span className="truncate">{getSpeechTypeLabel(speech.speech_type)}</span>
                    </Badge>
                  </span>
                  <span className="text-xs text-muted-foreground md:hidden mt-1">
                    {formatDate(speech.created_at)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center hidden md:table-cell">
                <Badge 
                  className={`${getTypeColor(speech.speech_type)} max-w-20 inline-flex justify-center`}
                >
                  <span className="truncate">{getSpeechTypeLabel(speech.speech_type)}</span>
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm whitespace-nowrap">
                <div className="flex flex-col">
                  <span>{formatDate(speech.created_at)}</span>
                  <span className="text-xs text-muted-foreground">{formatTime(speech.created_at)}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm whitespace-nowrap">
                <div className="flex flex-col">
                  <span>{formatDate(speech.updated_at)}</span>
                  <span className="text-xs text-muted-foreground">{formatTime(speech.updated_at)}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => onView(speech)}
                    title="View"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(speech)}
                    title="Edit"
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDelete(speech)}
                    title="Delete"
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
