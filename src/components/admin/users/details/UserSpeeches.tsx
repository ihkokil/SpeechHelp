
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Calendar, Clock, Eye, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { User } from '../types';
import { adminSpeechService } from '@/services/adminSpeechService';
import { Speech } from '@/types/speech';
import SpeechDetailView from '@/components/admin/speeches/SpeechDetailView';

interface SpeechWithUser extends Speech {
  user_email?: string;
  user_name?: string;
}

interface UserSpeechesProps {
  user: User;
}

export const UserSpeeches: React.FC<UserSpeechesProps> = ({ user }) => {
  const [speeches, setSpeeches] = useState<SpeechWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSpeech, setSelectedSpeech] = useState<SpeechWithUser | null>(null);

  useEffect(() => {
    const loadUserSpeeches = async () => {
      console.log('Loading speeches for user ID:', user.id);
      setIsLoading(true);
      
      try {
        // Use the admin speech service to fetch speeches by user ID
        const userSpeeches = await adminSpeechService.fetchSpeechesByUserId(user.id);
        console.log('Loaded speeches:', userSpeeches);
        
        // Enhance speeches with user information since we know the user
        const enhancedSpeeches: SpeechWithUser[] = userSpeeches.map(speech => ({
          ...speech,
          user_email: user.email,
          user_name: user.first_name && user.last_name 
            ? `${user.first_name} ${user.last_name}`
            : user.username || user.email
        }));
        
        setSpeeches(enhancedSpeeches);
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
  }, [user.id, user.email, user.first_name, user.last_name, user.username]);

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

  const handleViewSpeech = (speech: SpeechWithUser) => {
    setSelectedSpeech(speech);
  };

  const handleCloseSpeechView = () => {
    setSelectedSpeech(null);
  };

  if (selectedSpeech) {
    return (
      <SpeechDetailView
        speech={selectedSpeech}
        onBack={handleCloseSpeechView}
      />
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Speeches
          </CardTitle>
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

  const speechCount = speeches.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Speeches ({speechCount})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {speeches.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No speeches found</p>
            <p className="text-sm text-muted-foreground">This user hasn't created any speeches yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Modified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {speeches.map((speech) => (
                <TableRow key={speech.id}>
                  <TableCell className="font-medium max-w-xs truncate" title={speech.title}>
                    {speech.title}
                  </TableCell>
                  <TableCell>
                    <Badge className={getSpeechTypeColor(speech.speech_type)}>
                      {getSpeechTypeLabel(speech.speech_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(speech.created_at)}</TableCell>
                  <TableCell>{formatDate(speech.updated_at)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewSpeech(speech)}
                      className="h-8 w-8 p-0"
                      title="View speech"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
