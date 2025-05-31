
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { User, Speech } from '../types';
import { Calendar, Clock, FileText } from 'lucide-react';

interface UserActivityProps {
  user: User;
  speeches: Speech[];
  userJoinedDays: number;
  totalActivityTime: number;
}

export const UserActivity: React.FC<UserActivityProps> = ({ 
  user, 
  speeches, 
  userJoinedDays, 
  totalActivityTime 
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    try {
      return format(new Date(dateString), 'PPP p');
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "Invalid date";
    }
  };

  console.log("UserActivity component rendering:", { 
    userId: user.id, 
    speechesCount: speeches?.length,
    userJoinedDays,
    totalActivityTime,
    lastSignIn: user.last_sign_in_at
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/40 rounded-lg p-4 flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-sm">{formatDate(user.created_at)}</p>
              </div>
            </div>
            <div className="bg-muted/40 rounded-lg p-4 flex items-center space-x-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Days as Member</p>
                <p className="text-sm">{userJoinedDays} days</p>
              </div>
            </div>
            <div className="bg-muted/40 rounded-lg p-4 flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Last Login</p>
                <p className="text-sm">{user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Never'}</p>
              </div>
            </div>
            <div className="bg-muted/40 rounded-lg p-4 flex items-center space-x-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Speeches</p>
                <p className="text-sm">{speeches.length}</p>
              </div>
            </div>
            <div className="bg-muted/40 rounded-lg p-4 flex items-center space-x-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Est. Activity Time</p>
                <p className="text-sm">{totalActivityTime} minutes</p>
              </div>
            </div>
            <div className="bg-muted/40 rounded-lg p-4 flex items-center space-x-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Avg. Speech Length</p>
                <p className="text-sm">
                  {speeches.length > 0 
                    ? Math.round(speeches.reduce((sum, speech) => sum + (speech.content?.length || 0), 0) / speeches.length)
                    : 0} characters
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-3">Recent Activity</h4>
            {speeches.length === 0 ? (
              <div className="text-center py-6 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No recent activity recorded.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {speeches.slice(0, 3).map((speech) => (
                  <div key={speech.id} className="flex justify-between items-center text-sm p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>Created "{speech.title}"</span>
                    </div>
                    <span className="text-muted-foreground text-xs">{formatDate(speech.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
