
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
import { cn } from '@/lib/utils';

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

  // Responsive table layout - card style for mobile
  if (isMobile) {
    return (
      <div className="space-y-4 px-2">
        {speeches.map((speech) => (
          <div key={speech.id} className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-900 pr-2">{speech.title}</h3>
              <Badge 
                className={`${getTypeColor(speech.speech_type)} inline-flex justify-center px-2 whitespace-nowrap overflow-hidden text-ellipsis`}
                title={getSpeechTypeLabel(speech.speech_type)}
              >
                {getSpeechTypeLabel(speech.speech_type)}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm text-gray-500 mb-4">
              <div className="flex justify-between">
                <span><Translate text="dashboard.created" />:</span>
                <span>{formatDate(speech.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span><Translate text="dashboard.modified" />:</span>
                <span>{formatDate(speech.updated_at)}</span>
              </div>
            </div>
            
            <div className="flex justify-between pt-2 border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onView(speech)}
                className="flex-1"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                <span>View</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit(speech)}
                className="flex-1 mx-1"
              >
                <EditIcon className="h-4 w-4 mr-1" />
                <span>Edit</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete(speech)}
                className="flex-1 text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <Trash2Icon className="h-4 w-4 mr-1" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop table layout
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><Translate text="common.title" /></TableHead>
            <TableHead className="text-center"><Translate text="common.type" /></TableHead>
            <TableHead><Translate text="dashboard.created" /></TableHead>
            <TableHead><Translate text="dashboard.modified" /></TableHead>
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
              <TableCell>{formatDate(speech.created_at)}</TableCell>
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
