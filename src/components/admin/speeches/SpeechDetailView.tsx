
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Calendar, Clock, Type } from 'lucide-react';
import { format } from 'date-fns';

interface SpeechWithUser {
  id: string;
  title: string;
  content: string;
  speech_type: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_name?: string;
}

interface SpeechDetailViewProps {
  speech: SpeechWithUser;
  onBack: () => void;
}

const SpeechDetailView: React.FC<SpeechDetailViewProps> = ({ speech, onBack }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP p');
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
      return 'Invalid date';
    }
  };

  const getSpeechTypeColor = (speechType: string) => {
    const colors = {
      wedding: 'bg-pink-100 text-pink-800',
      business: 'bg-blue-100 text-blue-800',
      birthday: 'bg-yellow-100 text-yellow-800',
      graduation: 'bg-green-100 text-green-800',
      funeral: 'bg-gray-100 text-gray-800',
      motivational: 'bg-purple-100 text-purple-800',
      informative: 'bg-indigo-100 text-indigo-800',
      entertaining: 'bg-orange-100 text-orange-800',
      persuasive: 'bg-red-100 text-red-800',
      introduction: 'bg-teal-100 text-teal-800',
      farewell: 'bg-amber-100 text-amber-800',
      award: 'bg-emerald-100 text-emerald-800',
      retirement: 'bg-slate-100 text-slate-800',
      keynote: 'bg-violet-100 text-violet-800',
      tedtalk: 'bg-cyan-100 text-cyan-800',
      social: 'bg-lime-100 text-lime-800',
      other: 'bg-neutral-100 text-neutral-800'
    };
    return colors[speechType as keyof typeof colors] || colors.other;
  };

  const getSpeechTypeLabel = (speechType: string) => {
    return speechType.charAt(0).toUpperCase() + speechType.slice(1);
  };

  const formatContent = (content: string) => {
    // Handle potential JSON content
    if (content.startsWith('{') || content.startsWith('[')) {
      try {
        const parsed = JSON.parse(content);
        if (parsed.content) {
          return parsed.content;
        }
        return JSON.stringify(parsed, null, 2);
      } catch (e) {
        // If parsing fails, return original content
        return content;
      }
    }
    return content;
  };

  const wordCount = speech.content.split(' ').length;
  const estimatedReadingTime = Math.ceil(wordCount / 200); // Average reading speed

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to All Speeches
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{speech.title}</CardTitle>
              <div className="flex items-center gap-4">
                <Badge className={getSpeechTypeColor(speech.speech_type)}>
                  <Type className="h-3 w-3 mr-1" />
                  {getSpeechTypeLabel(speech.speech_type)}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {speech.user_name || speech.user_email || 'Unknown User'}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Speech Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">{formatDate(speech.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Modified</p>
                  <p className="text-sm text-muted-foreground">{formatDate(speech.updated_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Word Count</p>
                  <p className="text-sm text-muted-foreground">{wordCount} words (~{estimatedReadingTime} min read)</p>
                </div>
              </div>
            </div>

            {/* Speech Content */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Speech Content</h3>
              <div className="prose max-w-none bg-background border rounded-lg p-6">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {formatContent(speech.content)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpeechDetailView;
