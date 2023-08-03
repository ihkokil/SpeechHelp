
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
import { ScrollArea } from '@/components/ui/scroll-area';

interface SpeechesTableProps {
  speeches: Speech[];
  onView: (speech: Speech) => void;
  onEdit: (speech: Speech) => void;
  onDelete: (speech: Speech) => void;
}

const SpeechesTable = ({ speeches, onView, onEdit, onDelete }: SpeechesTableProps) => {
  const { isMobile } = useIsMobile();
  
  const formatDate = (dateString: string) => {
    // Ensure we're parsing the ISO string correctly before formatting
    const date = parseISO(dateString);
    return format(date, isMobile ? 'MMM d, yyyy' : 'MMM d, yyyy h:mm a');
  };

  return (
    <ScrollArea className="w-full">
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap"><Translate text="common.title" /></TableHead>
              <TableHead className="text-center"><Translate text="common.type" /></TableHead>
              {!isMobile && <TableHead><Translate text="dashboard.created" /></TableHead>}
              <TableHead><Translate text="dashboard.lastUpdated" /></TableHead>
              <TableHead className="text-right"><Translate text="common.actions" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {speeches.map((speech) => (
              <TableRow key={speech.id}>
                <TableCell className="font-medium truncate max-w-[120px] sm:max-w-none">
                  {speech.title}
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    className={`${getTypeColor(speech.speech_type)} mx-auto inline-flex justify-center h-6 px-2 whitespace-nowrap overflow-hidden text-ellipsis`}
                    title={getSpeechTypeLabel(speech.speech_type)}
                  >
                    {getSpeechTypeLabel(speech.speech_type)}
                  </Badge>
                </TableCell>
                {!isMobile && <TableCell>{formatDate(speech.created_at)}</TableCell>}
                <TableCell>{formatDate(speech.updated_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 sm:gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onView(speech)}
                      className="px-2 h-8"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit(speech)}
                      className="px-2 h-8"
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onDelete(speech)}
                      className="px-2 h-8"
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
    </ScrollArea>
  );
};

export default SpeechesTable;
