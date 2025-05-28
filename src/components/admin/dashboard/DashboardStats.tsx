
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Clock, UserPlus, TrendingUp, TrendingDown } from 'lucide-react';
import { DashboardData } from '@/pages/admin/AdminDashboard';

interface DashboardStatsProps {
  data: DashboardData;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ data }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getGrowthIcon = (growth: string) => {
    const isPositive = growth.startsWith('+');
    return isPositive ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getGrowthColor = (growth: string) => {
    const isPositive = growth.startsWith('+');
    return isPositive ? 'text-green-600' : 'text-red-600';
  };

  const stats = [
    {
      title: 'Total Users',
      value: formatNumber(data.totalUsers),
      change: data.userGrowth,
      icon: Users,
      description: 'All registered users'
    },
    {
      title: 'Active Users',
      value: formatNumber(data.activeUsers),
      change: data.activeSessionsGrowth,
      icon: Activity,
      description: 'Users active in last 7 days'
    },
    {
      title: 'Avg Session Time',
      value: data.avgSessionTime,
      change: data.usageTimeGrowth,
      icon: Clock,
      description: 'Average time per session'
    },
    {
      title: 'New Sign Ups',
      value: formatNumber(data.newSignUps),
      change: data.signupsGrowth,
      icon: UserPlus,
      description: 'New users in last 7 days'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  {getGrowthIcon(stat.change)}
                  <span className={`text-xs font-medium ${getGrowthColor(stat.change)}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
