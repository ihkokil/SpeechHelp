
import React from 'react';
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

const AdminDashboard = () => {
  const { adminUser } = useAdminAuth();

  // In a real app, these would be fetched from an API
  const stats = [
    {
      title: "Total Users",
      value: "2,856",
      icon: Users,
      change: "+12%",
      trend: "up",
      description: "from last month"
    },
    {
      title: "Active Sessions",
      value: "142",
      icon: Activity,
      change: "+8%",
      trend: "up",
      description: "from yesterday"
    },
    {
      title: "Avg. Usage Time",
      value: "18m 42s",
      icon: Clock,
      change: "-5%",
      trend: "down",
      description: "from last week"
    },
    {
      title: "New Sign Ups",
      value: "54",
      icon: UserPlus,
      change: "+15%",
      trend: "up",
      description: "from yesterday"
    }
  ];

  // Recent activities (would be fetched from API)
  const recentActivities = [
    {
      id: 1,
      user: "Alice Johnson",
      action: "Created a new speech",
      time: "5 minutes ago",
      status: "success"
    },
    {
      id: 2,
      user: "Bob Smith",
      action: "Updated profile information",
      time: "1 hour ago",
      status: "success"
    },
    {
      id: 3,
      user: "Carol Davis",
      action: "Failed login attempt",
      time: "2 hours ago",
      status: "warning"
    },
    {
      id: 4,
      user: "Dave Wilson",
      action: "Exported speech to PDF",
      time: "3 hours ago",
      status: "success"
    },
    {
      id: 5,
      user: "Eve Brown",
      action: "Subscription payment failed",
      time: "4 hours ago",
      status: "warning"
    }
  ];

  // System status (would be fetched from API)
  const systemStatus = {
    uptime: "99.98%",
    responseTime: "245ms",
    errors: "0.02%",
    warnings: 3
  };

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
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center pt-1 text-xs">
                {stat.trend === "up" ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="ml-1 text-gray-500">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Overview of the latest user activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
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
              ))}
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
