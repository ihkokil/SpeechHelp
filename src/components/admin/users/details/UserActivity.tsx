
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { User, Speech } from '../types';

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
    return format(new Date(dateString), 'PPP p');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Member Since</p>
              <p className="text-sm">{formatDate(user.created_at)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Days as Member</p>
              <p className="text-sm">{userJoinedDays} days</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Login</p>
              <p className="text-sm">{formatDate(user.last_sign_in_at) || 'Never'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Speeches</p>
              <p className="text-sm">{speeches.length}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Est. Activity Time</p>
              <p className="text-sm">{totalActivityTime} minutes</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Speech Length</p>
              <p className="text-sm">
                {speeches.length > 0 
                  ? Math.round(speeches.reduce((sum, speech) => sum + speech.content.length, 0) / speeches.length)
                  : 0} characters
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
            {speeches.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No recent activity recorded.</p>
            ) : (
              <div className="space-y-2">
                {speeches.slice(0, 3).map((speech) => (
                  <div key={speech.id} className="flex justify-between text-sm border-b pb-2">
                    <span>Created "{speech.title}"</span>
                    <span className="text-muted-foreground">{formatDate(speech.created_at)}</span>
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
