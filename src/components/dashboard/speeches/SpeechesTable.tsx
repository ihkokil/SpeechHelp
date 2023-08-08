
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
import { ScrollArea } from '@/components/ui/scroll-area';
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
    <div className="w-full">
      <ScrollArea className="w-full">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[25%]"><Translate text="common.title" /></TableHead>
                <TableHead className="text-center w-[15%]"><Translate text="common.type" /></TableHead>
                <TableHead className="w-[20%]"><Translate text="dashboard.created" /></TableHead>
                <TableHead className="w-[20%]"><Translate text="dashboard.lastUpdated" /></TableHead>
                <TableHead className="text-right w-[20%]"><Translate text="common.actions" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {speeches.map((speech) => (
                <TableRow key={speech.id}>
                  <TableCell className="font-medium">
                    <div className="truncate max-w-[200px]" title={speech.title}>
                      {speech.title}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      className={`${getTypeColor(speech.speech_type)} whitespace-nowrap px-2 py-1`}
                      title={getSpeechTypeLabel(speech.speech_type)}
                    >
                      {getSpeechTypeLabel(speech.speech_type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(speech.created_at)}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(speech.updated_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onView(speech)}
                        title="View"
                        className="whitespace-nowrap"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        <span>View</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onEdit(speech)}
                        title="Edit"
                        className="whitespace-nowrap"
                      >
                        <EditIcon className="h-4 w-4 mr-1" />
                        <span>Edit</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onDelete(speech)}
                        title="Delete"
                        className="whitespace-nowrap"
                      >
                        <Trash2Icon className="h-4 w-4 mr-1" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SpeechesTable;
