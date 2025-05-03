
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { User } from '../types';
import { Calendar, Clock, Activity, LayoutDashboard } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserActivityProps {
  user: User;
  userJoinedDays: number;
}

export const UserActivity: React.FC<UserActivityProps> = ({ 
  user, 
  userJoinedDays
}) => {
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'quarter' | 'all'>('all');
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    try {
      return format(new Date(dateString), 'PPP p');
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "Invalid date";
    }
  };

  // Log component rendering
  console.log("UserActivity component rendering:", { 
    userId: user.id, 
    userJoinedDays,
    lastSignIn: user.last_sign_in_at,
    timePeriod
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>User Activity</CardTitle>
          <Tabs value={timePeriod} onValueChange={(value) => setTimePeriod(value as 'week' | 'month' | 'quarter' | 'all')}>
            <TabsList>
              <TabsTrigger value="all">All time</TabsTrigger>
              <TabsTrigger value="quarter">3 months</TabsTrigger>
              <TabsTrigger value="month">30 days</TabsTrigger>
              <TabsTrigger value="week">7 days</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Account stats */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">Account Overview</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
          </div>
          
          {/* Account Status */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">
              Account Status
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/40 rounded-lg p-4 flex items-center space-x-3">
                <Activity className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Account Status</p>
                  <p className="text-sm">{user.is_active ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
              <div className="bg-muted/40 rounded-lg p-4 flex items-center space-x-3">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Subscription Plan</p>
                  <p className="text-sm capitalize">{user.subscription_plan || 'Free'}</p>
                </div>
              </div>
              <div className="bg-muted/40 rounded-lg p-4 flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Subscription Status</p>
                  <p className="text-sm capitalize">{user.subscription_status || 'Inactive'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Login History Placeholder */}
          <div className="mt-6">
            <h4 className="font-medium mb-3 text-muted-foreground">Recent Activity</h4>
            <div className="text-center py-6 bg-muted/30 rounded-lg">
              <Activity className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-muted-foreground">Activity tracking is available but no recent activity data is currently displayed.</p>
              <p className="text-sm text-muted-foreground mt-1">Last sign-in: {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Never logged in'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
