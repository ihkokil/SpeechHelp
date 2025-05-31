
import React from 'react';
import { User, Speech } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Calendar, Type } from 'lucide-react';
import { format } from 'date-fns';

interface UserSpeechesProps {
  user: User;
  speeches: Speech[];
  isLoadingSpeeches: boolean;
}

export const UserSpeeches: React.FC<UserSpeechesProps> = ({
  user,
  speeches,
  isLoadingSpeeches
}) => {
  console.log('UserSpeeches component rendering:', {
    userId: user.id,
    speechesLength: speeches?.length,
    isLoadingSpeeches,
    speeches: speeches
  });

  // Helper function to get speech type display name
  const getSpeechTypeDisplay = (speechType: string): string => {
    const typeMap: Record<string, string> = {
      'wedding': 'Wedding',
      'business': 'Business',
      'funeral': 'Funeral',
      'birthday': 'Birthday',
      'graduation': 'Graduation',
      'retirement': 'Retirement',
      'keynote': 'Keynote',
      'tedtalk': 'TED Talk',
      'motivational': 'Motivational',
      'persuasive': 'Persuasive',
      'informative': 'Informative',
      'entertaining': 'Entertaining',
      'farewell': 'Farewell',
      'award': 'Award',
      'introduction': 'Introduction',
      'social': 'Social',
      'other': 'Other'
    };
    
    return typeMap[speechType?.toLowerCase()] || speechType || 'Unknown';
  };

  // Helper function to get speech type color
  const getSpeechTypeColor = (speechType: string): string => {
    const colorMap: Record<string, string> = {
      'wedding': 'bg-pink-100 text-pink-800',
      'business': 'bg-blue-100 text-blue-800',
      'funeral': 'bg-gray-100 text-gray-800',
      'birthday': 'bg-yellow-100 text-yellow-800',
      'graduation': 'bg-green-100 text-green-800',
      'retirement': 'bg-purple-100 text-purple-800',
      'keynote': 'bg-indigo-100 text-indigo-800',
      'tedtalk': 'bg-red-100 text-red-800',
      'motivational': 'bg-orange-100 text-orange-800',
      'persuasive': 'bg-teal-100 text-teal-800',
      'informative': 'bg-cyan-100 text-cyan-800',
      'entertaining': 'bg-emerald-100 text-emerald-800',
      'farewell': 'bg-slate-100 text-slate-800',
      'award': 'bg-amber-100 text-amber-800',
      'introduction': 'bg-lime-100 text-lime-800',
      'social': 'bg-rose-100 text-rose-800',
      'other': 'bg-neutral-100 text-neutral-800'
    };
    
    return colorMap[speechType?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  // Helper function to truncate content
  const truncateContent = (content: string, maxLength: number = 100): string => {
    if (!content || content.length <= maxLength) return content || '';
    return content.substring(0, maxLength) + '...';
  };

  if (isLoadingSpeeches) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            User Speeches
          </CardTitle>
          <CardDescription>Speeches created by this user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading speeches...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!speeches || speeches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            User Speeches
          </CardTitle>
          <CardDescription>Speeches created by this user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No speeches found for this user</p>
            <p className="text-sm text-muted-foreground mt-2">
              This user hasn't created any speeches yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          User Speeches ({speeches.length})
        </CardTitle>
        <CardDescription>Speeches created by this user</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {speeches.map((speech) => (
            <div key={speech.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-1">{speech.title || 'Untitled Speech'}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={getSpeechTypeColor(speech.speech_type)}>
                      <Type className="h-3 w-3 mr-1" />
                      {getSpeechTypeDisplay(speech.speech_type)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {speech.content && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {truncateContent(speech.content, 150)}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Created: {speech.created_at ? format(new Date(speech.created_at), 'MMM d, yyyy') : 'Unknown'}
                </div>
                {speech.updated_at && speech.updated_at !== speech.created_at && (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Updated: {format(new Date(speech.updated_at), 'MMM d, yyyy')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
