
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Speech } from '@/components/admin/users/types';
import { Button } from '@/components/ui/button';

interface UserSpeechesProps {
  user: User;
  speeches?: Speech[];
  isLoadingSpeeches?: boolean;
}

export const UserSpeeches: React.FC<UserSpeechesProps> = ({ 
  user, 
  speeches = [], 
  isLoadingSpeeches = false 
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "Invalid date";
    }
  };

  // Debug logging
  console.log("UserSpeeches rendering with:", { 
    userId: user.id,
    speechesCount: speeches?.length,
    isLoading: isLoadingSpeeches,
    speeches: speeches
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>User Speeches</CardTitle>
        <CardDescription>
          All speeches created by {user.user_metadata?.full_name || user.email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingSpeeches ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : speeches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto opacity-20 mb-2" />
            <p>No speeches found for this user.</p>
            <p className="text-sm mt-2">This user hasn't created any speeches yet.</p>
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
