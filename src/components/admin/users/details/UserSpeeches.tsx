
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { User, Speech } from '../types';

interface UserSpeechesProps {
  user: User;
}

export const UserSpeeches: React.FC<UserSpeechesProps> = ({ user }) => {
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [isLoadingSpeeches, setIsLoadingSpeeches] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserSpeeches(user.id);
    }
  }, [user]);

  const fetchUserSpeeches = async (userId: string) => {
    setIsLoadingSpeeches(true);
    try {
      const { data, error } = await supabase
        .from('speeches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching user speeches:', error);
      } else {
        setSpeeches(data || []);
      }
    } catch (error) {
      console.error('Exception fetching user speeches:', error);
    } finally {
      setIsLoadingSpeeches(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP p');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Speeches</CardTitle>
        <CardDescription>
          All speeches created by this user
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingSpeeches ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Loading speeches...</p>
          </div>
        ) : speeches.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No speeches found for this user.</p>
        ) : (
          <div className="space-y-4">
            {speeches.map((speech) => (
              <div key={speech.id} className="border rounded-md p-4">
                <div className="flex justify-between">
                  <h4 className="font-medium">{speech.title}</h4>
                  <Badge>{speech.speech_type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Created: {formatDate(speech.created_at)}
                </p>
                <p className="text-sm mt-2 line-clamp-2">
                  {speech.content.substring(0, 150)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
