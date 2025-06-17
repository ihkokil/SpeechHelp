
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Calendar, Clock, Eye, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { User } from '../types';
import { adminSpeechService } from '@/services/adminSpeechService';
import { Speech } from '@/types/speech';

interface UserSpeechesProps {
  user: User;
}

export const UserSpeeches: React.FC<UserSpeechesProps> = ({ user }) => {
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSpeech, setSelectedSpeech] = useState<Speech | null>(null);

  useEffect(() => {
    const loadUserSpeeches = async () => {
      console.log('Loading speeches for user ID:', user.id);
      setIsLoading(true);
      
      try {
        const userSpeeches = await adminSpeechService.fetchSpeechesByUserId(user.id);
        console.log('Loaded speeches:', userSpeeches);
        setSpeeches(userSpeeches);
      } catch (error) {
        console.error('Error loading speeches:', error);
        setSpeeches([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user.id) {
      loadUserSpeeches();
    }
  }, [user.id]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
      return 'Invalid date';
    }
  };

  const handleViewSpeech = (speech: Speech) => {
    setSelectedSpeech(speech);
  };

  const handleCloseSpeechView = () => {
    setSelectedSpeech(null);
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Speeches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2 animate-spin" />
              <p className="text-muted-foreground">Loading speeches...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedSpeech) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Speech Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleCloseSpeechView}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{selectedSpeech.title}</h3>
              <div className="flex items-center space-x-4 mt-2">
                <Badge className={getSpeechTypeColor(selectedSpeech.speech_type)}>
                  {getSpeechTypeLabel(selectedSpeech.speech_type)}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created on {formatDate(selectedSpeech.created_at)}
                </span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Content</h4>
              <ScrollArea className="h-64 w-full border rounded-md p-4">
                <div className="whitespace-pre-wrap text-sm">
                  {selectedSpeech.content}
                </div>
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const speechCount = speeches.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Speeches
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          <div>{speechCount} speech{speechCount !== 1 ? 'es' : ''} found</div>
        </div>
      </CardHeader>
      <CardContent>
        {speeches.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No speeches found</p>
            <p className="text-sm text-muted-foreground">This user hasn't created any speeches yet.</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {speeches.map((speech) => (
                <div
                  key={speech.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleViewSpeech(speech)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-2 hover:text-primary">{speech.title}</h4>
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge className={getSpeechTypeColor(speech.speech_type)}>
                          {getSpeechTypeLabel(speech.speech_type)}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(speech.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {speech.content.substring(0, 100)}...
                      </p>
                    </div>
                    <div className="flex space-x-1 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewSpeech(speech);
                        }}
                        className="h-8 w-8 p-0"
                        title="View speech"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
