
import React, { useState } from 'react';
import { User, Speech } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, FileText, Calendar, Type, Eye, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { formatSpeechContent } from '@/components/speech/utils/speechFormattingUtils';

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
  const [selectedSpeech, setSelectedSpeech] = useState<Speech | null>(null);

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

  // Helper function to truncate content for preview
  const truncateContent = (content: string, maxLength: number = 100): string => {
    if (!content) return '';
    
    // Format the content first to get clean text
    const formattedContent = formatSpeechContent(content);
    
    // Remove any HTML tags for preview
    const cleanText = formattedContent.replace(/<[^>]*>/g, '');
    
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + '...';
  };

  // Helper function to format content for display in modal
  const formatContentForDisplay = (content: string): string => {
    if (!content) return 'No content available';
    
    const formattedContent = formatSpeechContent(content);
    
    // Convert markdown-like formatting to HTML
    let htmlContent = formattedContent;
    
    // Handle headings
    htmlContent = htmlContent.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4 text-purple-800">$1</h1>');
    htmlContent = htmlContent.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-purple-700">$1</h2>');
    htmlContent = htmlContent.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-5 mb-2 text-purple-600">$1</h3>');
    
    // Handle bold text
    htmlContent = htmlContent.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
    
    // Handle italic text
    htmlContent = htmlContent.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
    
    // Handle line breaks
    htmlContent = htmlContent.replace(/\n\n/g, '</p><p class="mb-4">');
    htmlContent = htmlContent.replace(/\n/g, '<br>');
    
    // Wrap in paragraph tags
    htmlContent = `<div class="prose prose-sm max-w-none"><p class="mb-4">${htmlContent}</p></div>`;
    
    // Fix any double paragraph tags
    htmlContent = htmlContent.replace(/<p class="mb-4"><p class="mb-4">/g, '<p class="mb-4">');
    htmlContent = htmlContent.replace(/<\/p><\/p>/g, '</p>');
    
    return htmlContent;
  };

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return 'Unknown';
    }
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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            User Speeches ({speeches.length})
          </CardTitle>
          <CardDescription>Speeches created by this user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {speeches.map((speech) => (
              <div key={speech.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-1 mb-2">{speech.title || 'Untitled Speech'}</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={getSpeechTypeColor(speech.speech_type)}>
                        <Type className="h-3 w-3 mr-1" />
                        {getSpeechTypeDisplay(speech.speech_type)}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeAgo(speech.created_at)}
                      </div>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedSpeech(speech)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          {speech.title || 'Untitled Speech'}
                        </DialogTitle>
                        <DialogDescription>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline" className={getSpeechTypeColor(speech.speech_type)}>
                              {getSpeechTypeDisplay(speech.speech_type)}
                            </Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              Created: {format(new Date(speech.created_at), 'MMM d, yyyy • HH:mm')}
                            </div>
                            {speech.updated_at && speech.updated_at !== speech.created_at && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-1" />
                                Updated: {format(new Date(speech.updated_at), 'MMM d, yyyy • HH:mm')}
                              </div>
                            )}
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="max-h-[60vh] pr-4">
                        <div 
                          className="text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ 
                            __html: formatContentForDisplay(speech.content) 
                          }} 
                        />
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {speech.content && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {truncateContent(speech.content, 150)}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Created: {speech.created_at ? format(new Date(speech.created_at), 'MMM d, yyyy • HH:mm') : 'Unknown'}
                  </div>
                  {speech.updated_at && speech.updated_at !== speech.created_at && (
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Updated: {format(new Date(speech.updated_at), 'MMM d, yyyy • HH:mm')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
