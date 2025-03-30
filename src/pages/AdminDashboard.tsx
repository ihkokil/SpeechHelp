
import { useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UsersIcon, ClockIcon, LineChartIcon, FileTextIcon, RefreshCwIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboard = () => {
  const { dashboardStats, refreshDashboardStats, isLoading } = useAdmin();

  useEffect(() => {
    if (!dashboardStats) {
      refreshDashboardStats();
    }
  }, [dashboardStats, refreshDashboardStats]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refreshDashboardStats()}
          disabled={isLoading}
        >
          <RefreshCwIcon className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
            <UsersIcon className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            {dashboardStats ? (
              <div className="text-3xl font-bold">{dashboardStats.total_users || 0}</div>
            ) : (
              <Skeleton className="h-8 w-20" />
            )}
            <p className="text-xs text-gray-500 mt-1">
              {dashboardStats?.new_users_last_day ? `+${dashboardStats.new_users_last_day} in the last 24h` : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Sessions</CardTitle>
            <ClockIcon className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            {dashboardStats ? (
              <div className="text-3xl font-bold">{dashboardStats.active_sessions || 0}</div>
            ) : (
              <Skeleton className="h-8 w-20" />
            )}
            <p className="text-xs text-gray-500 mt-1">Current active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Speech Count</CardTitle>
            <FileTextIcon className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            {dashboardStats ? (
              <div className="text-3xl font-bold">{dashboardStats.total_speeches || 0}</div>
            ) : (
              <Skeleton className="h-8 w-20" />
            )}
            <p className="text-xs text-gray-500 mt-1">Total speeches created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">System Status</CardTitle>
            <LineChartIcon className="h-5 w-5 text-pink-600" />
          </CardHeader>
          <CardContent>
            {dashboardStats?.system_status ? (
              <div className="text-lg font-bold">{dashboardStats.system_status.uptime}</div>
            ) : (
              <Skeleton className="h-8 w-20" />
            )}
            <p className="text-xs text-gray-500 mt-1">Uptime, {dashboardStats?.system_status?.error_rate || "0.00%"} error rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardStats?.recent_activities ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Speech</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardStats.recent_activities.map((activity: any, i: number) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4">{activity.user_email}</td>
                      <td className="py-3 px-4">{activity.title}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {activity.speech_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {formatDate(activity.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-[30%]" />
                  <Skeleton className="h-4 w-[40%]" />
                  <Skeleton className="h-4 w-[15%]" />
                  <Skeleton className="h-4 w-[15%]" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
