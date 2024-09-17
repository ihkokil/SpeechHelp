
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Loader2, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Speech } from '@/components/admin/users/types';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { formatUserDisplayName } from '../management/utils/userDisplayUtils';

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
  const [filter, setFilter] = useState<'all' | 'recent'>('all');
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "Invalid date";
    }
  };

  // Filter speeches based on selected filter
  const filteredSpeeches = useMemo(() => {
    if (filter === 'all') return speeches;
    
    // Recent speeches - last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return speeches.filter(speech => 
      new Date(speech.created_at) >= thirtyDaysAgo
    );
  }, [speeches, filter]);

  // Debug logging
  console.log("UserSpeeches rendering with:", { 
    userId: user.id,
    speechesCount: speeches?.length,
    filteredCount: filteredSpeeches.length,
    isLoading: isLoadingSpeeches,
    speeches: speeches
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Speeches</CardTitle>
            <CardDescription>
              All speeches created by {formatUserDisplayName(user)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={filter === 'all' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'recent' ? 'secondary' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('recent')}
            >
              Recent (30d)
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingSpeeches ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredSpeeches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto opacity-20 mb-2" />
            <p>No speeches found for this user{filter === 'recent' ? ' in the last 30 days' : ''}.</p>
            {filter === 'recent' && speeches.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => setFilter('all')}
              >
                Show all speeches
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-3">
              <div className="text-sm text-muted-foreground">
                Showing {filteredSpeeches.length} speech{filteredSpeeches.length !== 1 ? 'es' : ''}
                {filter === 'recent' ? ' from the last 30 days' : ''}
              </div>
            </div>

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
                  {filteredSpeeches.map((speech) => (
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
          </>
        )}
      </CardContent>
    </Card>
  );
};
