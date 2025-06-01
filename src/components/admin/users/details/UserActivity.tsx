
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format, subDays, subMonths, isAfter, parseISO } from 'date-fns';
import { User, Speech } from '../types';
import { Calendar, Clock, FileText, BarChart, Activity, LayoutDashboard } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatUserDisplayName } from '../management/utils/userDisplayUtils';

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

  // Filter speeches by time period
  const getFilteredSpeeches = () => {
    const now = new Date();
    let cutoffDate: Date;
    
    switch (timePeriod) {
      case 'week':
        cutoffDate = subDays(now, 7);
        break;
      case 'month':
        cutoffDate = subMonths(now, 1);
        break;
      case 'quarter':
        cutoffDate = subMonths(now, 3);
        break;
      case 'all':
      default:
        return speeches;
    }
    
    return speeches.filter(speech => {
      try {
        const speechDate = parseISO(speech.created_at);
        return isAfter(speechDate, cutoffDate);
      } catch (e) {
        console.error("Error parsing date:", speech.created_at, e);
        return false;
      }
    });
  };

  const filteredSpeeches = getFilteredSpeeches();
  
  // Calculate speech creation frequency (speeches per period)
  const getSpeechFrequency = () => {
    if (speeches.length === 0) return 0;
    
    let divisor = 1;
    switch (timePeriod) {
      case 'week':
        divisor = 7; // days in a week
        break;
      case 'month':
        divisor = 30; // approximate days in a month
        break;
      case 'quarter':
        divisor = 90; // approximate days in a quarter
        break;
      case 'all':
        divisor = Math.max(userJoinedDays, 1);
        break;
    }
    
    return (filteredSpeeches.length / divisor).toFixed(2);
  };

  // Calculate estimated session time for the period
  const getEstimatedSessionTime = () => {
    if (filteredSpeeches.length === 0) return 0;
    
    // Rough estimate: 10 minutes per speech
    return filteredSpeeches.length * 10;
  };

  // Log component rendering
  console.log("UserActivity component rendering:", { 
    userId: user.id, 
    speechesCount: speeches?.length,
    filteredCount: filteredSpeeches.length,
    userJoinedDays,
    totalActivityTime,
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
          
          {/* Period stats */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">
              Activity {timePeriod !== 'all' ? `(Last ${timePeriod === 'week' ? '7 days' : timePeriod === 'month' ? '30 days' : '3 months'})` : ''}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/40 rounded-lg p-4 flex items-center space-x-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Speeches Created</p>
                  <p className="text-sm">{filteredSpeeches.length}</p>
                </div>
              </div>
              <div className="bg-muted/40 rounded-lg p-4 flex items-center space-x-3">
                <BarChart className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Creation Frequency</p>
                  <p className="text-sm">{getSpeechFrequency()} speeches/day</p>
                </div>
              </div>
              <div className="bg-muted/40 rounded-lg p-4 flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Est. Session Time</p>
                  <p className="text-sm">{getEstimatedSessionTime()} minutes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Speech metrics */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">Speech Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/40 rounded-lg p-4 flex items-center space-x-3">
                <Activity className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Avg. Speech Length</p>
                  <p className="text-sm">
                    {speeches.length > 0 
                      ? Math.round(speeches.reduce((sum, speech) => sum + (speech.content?.length || 0), 0) / speeches.length)
                      : 0} characters
                  </p>
                </div>
              </div>
              <div className="bg-muted/40 rounded-lg p-4 flex items-center space-x-3">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Active Speech Types</p>
                  <p className="text-sm">
                    {speeches.length > 0
                      ? new Set(speeches.map(s => s.speech_type)).size
                      : 0}
                  </p>
                </div>
              </div>
              <div className="bg-muted/40 rounded-lg p-4 flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Total Activity</p>
                  <p className="text-sm">{totalActivityTime} minutes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6">
            <h4 className="font-medium mb-3 text-muted-foreground">Recent Activity</h4>
            {filteredSpeeches.length === 0 ? (
              <div className="text-center py-6 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No activity recorded for the selected period.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSpeeches.slice(0, 3).map((speech) => (
                  <div key={speech.id} className="flex justify-between items-center text-sm p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>Created "{speech.title}"</span>
                    </div>
                    <span className="text-muted-foreground text-xs">{formatDate(speech.created_at)}</span>
                  </div>
                ))}
                
                {filteredSpeeches.length > 3 && (
                  <div className="text-center pt-2">
                    <span className="text-sm text-muted-foreground">
                      +{filteredSpeeches.length - 3} more activities
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
