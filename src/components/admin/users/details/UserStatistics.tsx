
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PieChart, Calendar, Clock } from 'lucide-react';
import { User } from '../types';

interface UserStatisticsProps {
  user: User;
}

export const UserStatistics: React.FC<UserStatisticsProps> = ({ user }) => {
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
    userJoinedDays
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Statistics</CardTitle>
        <CardDescription>
          General statistics about the user's account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Account Overview */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Account Information
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Days as Member</span>
                <span className="text-sm text-muted-foreground">{userJoinedDays}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Account Status</span>
                <span className="text-sm text-muted-foreground">
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Subscription Plan</span>
                <span className="text-sm text-muted-foreground capitalize">
                  {user.subscription_plan || 'Free'}
                </span>
              </div>
              
              {user.subscription_end_date && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Subscription Ends</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(user.subscription_end_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Account Activity */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Activity Summary
            </h4>
            
            <div className="text-center py-4">
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <PieChart className="h-8 w-8" />
                <p className="text-sm">Detailed activity metrics are available in the Activity tab.</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
