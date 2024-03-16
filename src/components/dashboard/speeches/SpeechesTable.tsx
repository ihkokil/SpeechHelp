
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Speech } from '@/types/speech';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EditIcon, Trash2Icon, EyeIcon, CalendarClock } from 'lucide-react';
import { format, parseISO, isValid, differenceInDays } from 'date-fns';
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

  const formatDate = (dateString: string, eventDate?: string) => {
    if (!dateString && eventDate) {
      try {
        const parsedEventDate = parseISO(eventDate);
        if (isValid(parsedEventDate)) {
          const daysLeft = differenceInDays(parsedEventDate, new Date());
          return `Not Yet Created (${daysLeft > 0 ? daysLeft : 0} days left)`;
        }
      } catch (error) {
        console.error('Error calculating days left:', error);
      }
      return 'Not Yet Created';
    }
    
    if (!dateString || dateString.trim() === '') {
      return '';
    }
    
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return '';
      }
      return format(date, isMobile ? 'MMM d' : 'MMM d, yyyy h:mm a');
    } catch (error) {
      console.error('Date parsing error:', error);
      return '';
    }
  };

  // Ensure we have unique speeches
  const uniqueSpeeches = Array.from(
    new Map(speeches.map(speech => [speech.id, speech])).values()
  );

  if (isMobile) {
    // Mobile version - card-based layout
    return (
      <div className="space-y-4">
        {uniqueSpeeches.map((speech) => {
          // Ensure isUpcoming is consistently applied
          const isUpcoming = speech.isUpcoming === true || 
            (speech.event_date && new Date(speech.event_date) > new Date());
          
          const displayType = isUpcoming ? 'upcoming' : speech.speech_type;
          
          return (
            <div key={speech.id} className="bg-white rounded-lg border p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900 flex items-center">
                  {isUpcoming && <CalendarClock className="h-4 w-4 text-blue-500 mr-1" />}
                  {speech.title}
                </h3>
                <Badge 
                  className={`${getTypeColor(displayType)} h-6 px-2 whitespace-nowrap`}
                >
                  {isUpcoming ? 'Upcoming' : getSpeechTypeLabel(displayType)}
                </Badge>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1 mb-3">
                {speech.created_at && (
                  <p>Created: {formatDate(speech.created_at, speech.event_date)}</p>
                )}
                {speech.updated_at && speech.updated_at !== speech.created_at && (
                  <p>Updated: {formatDate(speech.updated_at)}</p>
                )}
              </div>
              
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
            </div>
          );
        })}
      </div>
    );
  }

  // Desktop version - table layout
  return (
    <div className="overflow-x-auto">
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
          {uniqueSpeeches.map((speech) => {
            // Ensure isUpcoming is consistently applied
            const isUpcoming = speech.isUpcoming === true || 
              (speech.event_date && new Date(speech.event_date) > new Date());
            
            const displayType = isUpcoming ? 'upcoming' : speech.speech_type;
            
            return (
              <TableRow key={speech.id}>
                <TableCell className="font-medium max-w-[200px] truncate">
                  <div className="flex items-center gap-2">
                    {/* Consistently show calendar icon for all upcoming speeches */}
                    {isUpcoming && <CalendarClock className="h-4 w-4 text-blue-500" />}
                    {speech.title}
                  </div>
                  <div className="md:hidden mt-1">
                    <Badge 
                      className={`${getTypeColor(displayType)} inline-flex justify-center h-6 px-2 whitespace-nowrap overflow-hidden text-ellipsis`}
                      title={getSpeechTypeLabel(displayType)}
                    >
                      {isUpcoming ? 'Upcoming' : getSpeechTypeLabel(displayType)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center hidden md:table-cell">
                  <Badge 
                    className={`${getTypeColor(displayType)} mx-auto inline-flex justify-center w-32 h-6 px-2 whitespace-nowrap overflow-hidden text-ellipsis`}
                    title={isUpcoming ? 'Upcoming Speech' : getSpeechTypeLabel(displayType)}
                  >
                    {isUpcoming ? 'Upcoming' : getSpeechTypeLabel(displayType)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(speech.created_at, speech.event_date)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(speech.updated_at)}
                </TableCell>
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default SpeechesTable;
