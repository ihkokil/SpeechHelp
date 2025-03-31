
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { User, Speech } from '@/components/admin/users/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, FileText, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface UserSpeechesProps {
  user: User;
}

export const UserSpeeches: React.FC<UserSpeechesProps> = ({ user }) => {
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSpeech, setSelectedSpeech] = useState<Speech | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchUserSpeeches();
  }, [user.id]);

  const fetchUserSpeeches = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('speeches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching user speeches:', error);
      } else {
        setSpeeches(data || []);
      }
    } catch (error) {
      console.error('Exception fetching user speeches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const handleViewSpeech = (speech: Speech) => {
    setSelectedSpeech(speech);
    // Implement view dialog functionality if needed
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>User Speeches</CardTitle>
        <CardDescription>
          All speeches created by {user.user_metadata?.full_name || user.email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : speeches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto opacity-20 mb-2" />
            <p>No speeches found for this user.</p>
          </div>
        ) : (
          <ScrollArea className="h-[350px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Modified</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {speeches.map((speech) => (
                  <TableRow key={speech.id}>
                    <TableCell className="font-medium">{speech.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{speech.speech_type}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(speech.created_at)}</TableCell>
                    <TableCell>{speech.updated_at ? formatDate(speech.updated_at) : '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewSpeech(speech)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
