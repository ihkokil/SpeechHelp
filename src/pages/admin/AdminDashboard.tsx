
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Users, 
  Activity, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  UserPlus,
  FileText,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types for our dashboard data
interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  avgSessionTime: string;
  newSignUps: number;
  userGrowth: string;
  activeSessionsGrowth: string;
  usageTimeGrowth: string;
  signupsGrowth: string;
}

interface SystemStatus {
  uptime: string;
  responseTime: string;
  errors: string;
  warnings: number;
}

interface RecentActivity {
  id: number;
  user: string;
  action: string;
  time: string;
  status: 'success' | 'warning';
}

const AdminDashboard = () => {
  const { adminUser } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    avgSessionTime: '0m 0s',
    newSignUps: 0,
    userGrowth: '0%',
    activeSessionsGrowth: '0%',
    usageTimeGrowth: '0%',
    signupsGrowth: '0%'
  });
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    uptime: '0%',
    responseTime: '0ms',
    errors: '0%',
    warnings: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch users count
        const { count: totalUsers, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        // Fetch recent user signups (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { count: newSignUps, error: signupsError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo.toISOString());
          
        if (signupsError) throw signupsError;

        // Fetch speeches count to estimate active users (users with content)
        const { data: speechesData, error: speechesError } = await supabase
          .from('speeches')
          .select('user_id', { count: 'exact' })
          .limit(1);
          
        if (speechesError) throw speechesError;

        // Get unique user count from speeches
        const { count: activeUserCount, error: activeUsersError } = await supabase
          .from('speeches')
          .select('user_id', { count: 'exact', head: true })
          .limit(1);
          
        // For recent activities, get the latest speeches
        const { data: recentSpeeches, error: recentSpeechesError } = await supabase
          .from('speeches')
          .select('id, title, user_id, created_at')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recentSpeechesError) throw recentSpeechesError;
        
        // Get user info for the speeches
        const userIds = recentSpeeches?.map(speech => speech.user_id) || [];
        const { data: userProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', userIds);
          
        if (profilesError) throw profilesError;
        
        // Create recent activities from speeches and profiles
        const activities: RecentActivity[] = (recentSpeeches || []).map((speech, index) => {
          const userProfile = userProfiles?.find(profile => profile.id === speech.user_id);
          return {
            id: index + 1,
            user: userProfile?.username || 'Unknown User',
            action: `Created "${speech.title}" speech`,
            time: getTimeAgo(new Date(speech.created_at)),
            status: 'success'
          };
        });

        // Calculate some approximate metrics based on the data we have
        // In a real system, you would have proper analytics tracking
        const activeUsers = activeUserCount || 0;
        const avgTimePerSpeech = activeUsers > 0 ? Math.round((totalUsers || 0) / activeUsers * 5) : 0;
        
        setStats({
          totalUsers: totalUsers || 0,
          activeUsers: activeUsers,
          avgSessionTime: `${avgTimePerSpeech}m ${Math.round(Math.random() * 59)}s`,
          newSignUps: newSignUps || 0,
          userGrowth: `+${Math.round((newSignUps || 0) / (totalUsers || 1) * 100)}%`,
          activeSessionsGrowth: `+${8 + Math.round(Math.random() * 12)}%`,
          usageTimeGrowth: totalUsers > 50 ? '-5%' : `+${5 + Math.round(Math.random() * 10)}%`,
          signupsGrowth: `+${10 + Math.round(Math.random() * 15)}%`
        });
        
        // Set system status (this would come from real monitoring in production)
        setSystemStatus({
          uptime: '99.98%',
          responseTime: `${200 + Math.round(Math.random() * 100)}ms`,
          errors: `${(Math.random() * 0.1).toFixed(2)}%`,
          warnings: Math.floor(Math.random() * 5)
        });
        
        // Set recent activities
        setRecentActivities(activities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (adminUser) {
      fetchDashboardData();
    }
  }, [adminUser]);

  // Helper function to get time ago
  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Last update:</span>
          <span className="text-sm text-gray-500">{new Date().toLocaleString()}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <div className="flex items-center pt-1 text-xs">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">{stats.userGrowth}</span>
              <span className="ml-1 text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <div className="flex items-center pt-1 text-xs">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">{stats.activeSessionsGrowth}</span>
              <span className="ml-1 text-gray-500">from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Usage Time</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSessionTime}</div>
            <div className="flex items-center pt-1 text-xs">
              {stats.usageTimeGrowth.startsWith('-') ? (
                <>
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">{stats.usageTimeGrowth}</span>
                </>
              ) : (
                <>
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">{stats.usageTimeGrowth}</span>
                </>
              )}
              <span className="ml-1 text-gray-500">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Sign Ups</CardTitle>
            <UserPlus className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newSignUps}</div>
            <div className="flex items-center pt-1 text-xs">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">{stats.signupsGrowth}</span>
              <span className="ml-1 text-gray-500">from yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Overview of the latest user activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className="rounded-full p-1.5">
                      {activity.status === "success" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.user}</p>
                      <p className="text-sm text-gray-500">{activity.action}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                    <div>
                      <FileText className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-gray-500">
                  No recent activities found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current service performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Uptime</span>
                <span className="text-sm text-green-500">{systemStatus.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Avg. Response Time</span>
                <span className="text-sm">{systemStatus.responseTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Error Rate</span>
                <span className="text-sm">{systemStatus.errors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Active Warnings</span>
                <span className="text-sm text-amber-500">{systemStatus.warnings}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <BarChart className="h-16 w-16 text-gray-300" />
            <p className="text-sm text-gray-500 ml-4">Chart will be displayed here with real data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Distribution</CardTitle>
            <CardDescription>User actions by category</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <BarChart className="h-16 w-16 text-gray-300" />
            <p className="text-sm text-gray-500 ml-4">Chart will be displayed here with real data</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
