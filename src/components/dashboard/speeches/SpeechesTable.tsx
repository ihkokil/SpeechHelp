
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
    <ScrollArea className="w-full rounded-md border">
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]"><Translate text="common.title" /></TableHead>
              <TableHead className="text-center min-w-[100px]"><Translate text="common.type" /></TableHead>
              <TableHead className="min-w-[130px]"><Translate text="dashboard.created" /></TableHead>
              <TableHead className="min-w-[130px]"><Translate text="dashboard.lastUpdated" /></TableHead>
              <TableHead className="text-right min-w-[120px]"><Translate text="common.actions" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {speeches.map((speech) => (
              <TableRow key={speech.id}>
                <TableCell className="font-medium truncate max-w-[150px] md:max-w-none">
                  {speech.title}
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    className={`${getTypeColor(speech.speech_type)} mx-auto inline-flex justify-center w-full max-w-[100px] h-6 px-2 whitespace-nowrap overflow-hidden text-ellipsis`}
                    title={getSpeechTypeLabel(speech.speech_type)}
                  >
                    {getSpeechTypeLabel(speech.speech_type)}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">{formatDate(speech.created_at)}</TableCell>
                <TableCell className="whitespace-nowrap">{formatDate(speech.updated_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 md:gap-2">
                    <Button 
                      variant="outline" 
                      size={isMobile ? "icon" : "sm"}
                      onClick={() => onView(speech)}
                      title="View"
                    >
                      <EyeIcon className="h-4 w-4" />
                      {!isMobile && <span className="sr-only md:not-sr-only md:ml-2">View</span>}
                    </Button>
                    <Button 
                      variant="outline" 
                      size={isMobile ? "icon" : "sm"}
                      onClick={() => onEdit(speech)}
                      title="Edit"
                    >
                      <EditIcon className="h-4 w-4" />
                      {!isMobile && <span className="sr-only md:not-sr-only md:ml-2">Edit</span>}
                    </Button>
                    <Button 
                      variant="outline" 
                      size={isMobile ? "icon" : "sm"} 
                      onClick={() => onDelete(speech)}
                      title="Delete"
                    >
                      <Trash2Icon className="h-4 w-4" />
                      {!isMobile && <span className="sr-only md:not-sr-only md:ml-2">Delete</span>}
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
