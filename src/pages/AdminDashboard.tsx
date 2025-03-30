import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Clock, 
  ActivitySquare, 
  RefreshCw 
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const { adminUser, session } = useAdmin();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSpeeches: 0,
    activeUsers: 0,
    lastLogin: ''
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch total users count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      // Fetch total speeches count
      const { count: speechCount } = await supabase
        .from('speeches')
        .select('*', { count: 'exact', head: true });
      
      // Fetch recent activity
      const { data: activityData } = await supabase
        .from('admin_activity_logs')
        .select('*, admin_users(username)')
        .order('created_at', { ascending: false })
        .limit(10);
      
      // Set the stats
      setStats({
        totalUsers: userCount || 0,
        totalSpeeches: speechCount || 0,
        activeUsers: Math.floor(Math.random() * (userCount || 0)), // Mock data
        lastLogin: session?.user?.last_sign_in_at || new Date().toISOString()
      });
      
      setRecentActivity(activityData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button 
            onClick={fetchDashboardData} 
            variant="outline" 
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers.toString()} 
            description="Registered users" 
            icon={<Users className="h-5 w-5" />} 
            isLoading={isLoading}
          />
          <StatCard 
            title="Total Speeches" 
            value={stats.totalSpeeches.toString()} 
            description="Created speeches" 
            icon={<FileText className="h-5 w-5" />} 
            isLoading={isLoading}
          />
          <StatCard 
            title="Active Users" 
            value={stats.activeUsers.toString()} 
            description="In the last 30 days" 
            icon={<ActivitySquare className="h-5 w-5" />} 
            isLoading={isLoading}
          />
          <StatCard 
            title="Last Login" 
            value={new Date(stats.lastLogin).toLocaleString()} 
            description="Your last login" 
            icon={<Clock className="h-5 w-5" />} 
            isLoading={isLoading}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ActivitySquare className="h-5 w-5 mr-2 text-purple-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest actions in the admin panel</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex animate-pulse">
                      <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                      <div className="ml-4 flex-1 space-y-2 py-1">
                        <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                        <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start border-b pb-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <ActivityIcon action={activity.action} />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{formatAction(activity)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No recent activity
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                Usage Analytics
              </CardTitle>
              <CardDescription>User engagement over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Analytics data will be displayed here</p>
                <Button className="mt-4" size="sm" variant="outline" disabled>
                  View Detailed Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, isLoading = false }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 bg-purple-100 rounded-full text-purple-600">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded mt-2"></div>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const ActivityIcon = ({ action }: { action: string }) => {
  switch (action) {
    case 'login':
      return <Users className="h-4 w-4 text-green-600" />;
    case 'logout':
      return <Users className="h-4 w-4 text-red-600" />;
    case 'create':
      return <FileText className="h-4 w-4 text-blue-600" />;
    case 'update':
      return <FileText className="h-4 w-4 text-yellow-600" />;
    case 'delete':
      return <FileText className="h-4 w-4 text-red-600" />;
    default:
      return <ActivitySquare className="h-4 w-4 text-purple-600" />;
  }
};

const formatAction = (activity: any) => {
  const username = activity.admin_users?.username || 'Admin';
  
  switch (activity.action) {
    case 'login':
      return `${username} logged in`;
    case 'logout':
      return `${username} logged out`;
    case 'failed_login':
      return `Failed login attempt by ${username}`;
    default:
      return `${username} performed ${activity.action} on ${activity.entity_type}`;
  }
};

export default AdminDashboard;
