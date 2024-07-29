
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2, PieChart, BarChart } from 'lucide-react';
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
    
    try {
      const createdDate = new Date(user.created_at);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - createdDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (e) {
      console.error("Error calculating joined days:", e);
      return 0;
    }
  }, [user.created_at]);

  console.log("UserStatistics component rendering:", { 
    userId: user.id, 
    speechesCount: speeches?.length, 
    speechTypeStats,
    isLoadingSpeeches
  });

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
          <div className="text-center py-8 rounded-lg bg-muted/30 flex flex-col items-center">
            <PieChart className="h-12 w-12 text-muted-foreground/30 mb-2" />
            <p className="text-muted-foreground">No speech data available for statistics.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <BarChart className="h-4 w-4 mr-1" />
                Total Speeches: {speeches.length}
              </h4>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Speech Types</h4>
                <div className="space-y-3">
                  {speechTypeStats.map((stat) => (
                    <div key={stat.type} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{stat.type}</span>
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
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Monthly Activity</h4>
              <div className="text-center py-2">
                <p className="text-sm">
                  Average speeches per month: {userJoinedDays > 0 ? 
                    (speeches.length / (userJoinedDays / 30)).toFixed(1) : 
                    speeches.length.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
