
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { User, Speech, SpeechTypeStats } from '../types';

interface UserStatisticsProps {
  user: User;
  speeches: Speech[];
  isLoadingSpeeches: boolean;
}

export const UserStatistics: React.FC<UserStatisticsProps> = ({ user, speeches, isLoadingSpeeches }) => {
  // Group speeches by type
  const speechTypeStats: SpeechTypeStats[] = React.useMemo(() => {
    const typeCount: Record<string, number> = {};
    
    speeches.forEach(speech => {
      const type = speech.speech_type || 'unknown';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    
    return Object.entries(typeCount)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [speeches]);

  // Calculate days since user joined
  const userJoinedDays = React.useMemo(() => {
    if (!user.created_at) return 0;
    
    const createdDate = new Date(user.created_at);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [user.created_at]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Speech Statistics</CardTitle>
        <CardDescription>
          Statistics about the user's speeches
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingSpeeches ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Loading statistics...</p>
          </div>
        ) : speeches.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No speech data available for statistics.</p>
        ) : (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Total Speeches: {speeches.length}</h4>
              
              <h4 className="text-sm font-medium mb-2 mt-4">Speech Types</h4>
              <div className="space-y-2">
                {speechTypeStats.map((stat) => (
                  <div key={stat.type} className="flex justify-between items-center">
                    <span className="text-sm">{stat.type}</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden mr-2">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${(stat.count / speeches.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">{stat.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Monthly Activity</h4>
              <div className="rounded-md bg-muted/50 p-4">
                <p className="text-center text-sm text-muted-foreground">
                  Average speeches per month: {(speeches.length / (userJoinedDays / 30)).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
