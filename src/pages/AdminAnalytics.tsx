
import { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieChartIcon,
  Calendar 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  
  // Mock data for analytics
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'New Users',
        data: [12, 19, 25, 32, 45, 48, 57, 63, 78, 85, 92, 100],
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 2,
      },
    ],
  };
  
  const speechTypeData = {
    labels: ['Wedding', 'Birthday', 'Graduation', 'Business', 'Keynote', 'Funeral', 'Other'],
    datasets: [
      {
        label: 'Speeches by Type',
        data: [35, 25, 15, 10, 8, 4, 3],
        backgroundColor: [
          'rgba(147, 51, 234, 0.7)',
          'rgba(217, 70, 239, 0.7)',
          'rgba(236, 72, 153, 0.7)',
          'rgba(249, 168, 212, 0.7)',
          'rgba(129, 140, 248, 0.7)',
          'rgba(96, 165, 250, 0.7)',
          'rgba(147, 197, 253, 0.7)',
        ],
        borderColor: [
          'rgb(147, 51, 234)',
          'rgb(217, 70, 239)',
          'rgb(236, 72, 153)',
          'rgb(249, 168, 212)',
          'rgb(129, 140, 248)',
          'rgb(96, 165, 250)',
          'rgb(147, 197, 253)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const userActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Users',
        data: [42, 38, 45, 50, 55, 40, 35],
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
      {
        label: 'New Speeches',
        data: [20, 25, 30, 35, 28, 15, 12],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-purple-600" />
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={timeRange === 'week' ? 'default' : 'outline'} 
              onClick={() => setTimeRange('week')}
              size="sm"
            >
              Week
            </Button>
            <Button 
              variant={timeRange === 'month' ? 'default' : 'outline'} 
              onClick={() => setTimeRange('month')}
              size="sm"
            >
              Month
            </Button>
            <Button 
              variant={timeRange === 'year' ? 'default' : 'outline'} 
              onClick={() => setTimeRange('year')}
              size="sm"
            >
              Year
            </Button>
            <Button 
              variant={timeRange === 'all' ? 'default' : 'outline'} 
              onClick={() => setTimeRange('all')}
              size="sm"
            >
              All Time
            </Button>
          </div>
        </div>
        
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
              User Growth
            </CardTitle>
            <CardDescription>
              Track user sign-ups over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <BarChart data={userGrowthData} />
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Speech Types Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChartIcon className="h-5 w-5 mr-2 text-purple-600" />
                Speech Types
              </CardTitle>
              <CardDescription>
                Distribution of speeches by type.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <PieChart data={speechTypeData} />
              </div>
            </CardContent>
          </Card>
          
          {/* User Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                Weekly Activity
              </CardTitle>
              <CardDescription>
                User activity and new speeches created.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <LineChart data={userActivityData} />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Additional Analytics Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Speech Word Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,482,567</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> 
                12% increase this month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Speech Length</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">587 words</div>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <span className="h-3 w-3 mr-1">≈</span> 
                4 minutes read time
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18m 24s</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> 
                3% increase this month
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
