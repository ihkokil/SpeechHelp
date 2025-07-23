
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Speech } from '@/types/speech';
import { getSpeechTypeLabel, getSpeechTypeColor, formatSpeechDate } from '../speech-utils';

interface MobileSpeechTableProps {
  speeches: Speech[];
  onView: (speech: Speech) => void;
  onEdit: (speech: Speech) => void;
  onDelete: (speech: Speech) => void;
}

const MobileSpeechTable = ({ speeches, onView, onEdit, onDelete }: MobileSpeechTableProps) => {
  return (
    <div className="space-y-4">
      {speeches.map((speech) => (
        <Card key={speech.id} className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-medium mb-2">{speech.title}</CardTitle>
                <Badge 
                  variant="speech"
                  className={getSpeechTypeColor(speech.speech_type)}
                >
                  {getSpeechTypeLabel(speech.speech_type)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div>Created: {formatSpeechDate(speech.created_at)}</div>
              <div>Modified: {formatSpeechDate(speech.updated_at)}</div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(speech)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(speech)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(speech)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MobileSpeechTable;
