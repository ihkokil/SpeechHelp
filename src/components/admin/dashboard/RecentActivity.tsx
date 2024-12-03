
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, User, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: number;
  user: string;
  action: string;
  time: string;
  status: 'success' | 'warning' | 'error';
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getUserInitials = (user: string): string => {
    return user
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserAvatarUrl = (user: string): string => {
    // Generate a consistent avatar based on user email/name
    const hash = user.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return `https://avatar.vercel.sh/${Math.abs(hash)}`;
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest user activities and system events</CardDescription>
      </CardHeader>
      <CardContent>
        {activities && activities.length > 0 ? (
          <ScrollArea className="h-80">
            <div className="space-y-4 pr-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getUserAvatarUrl(activity.user)} />
                    <AvatarFallback className="bg-pink-100 text-pink-600">
                      {getUserInitials(activity.user)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.user}
                      </p>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(activity.status)}
                        <Badge variant={getStatusBadgeVariant(activity.status)} className="text-xs">
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
            <p className="text-sm text-gray-400 mt-2">
              User activities will appear here once they start using the platform.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
