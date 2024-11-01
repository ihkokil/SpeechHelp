
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Clock, UserPlus, TrendingUp, TrendingDown } from 'lucide-react';
import type { DashboardData } from '@/pages/admin/AdminDashboard';

interface DashboardStatsProps {
  data: DashboardData;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ data }) => {
  const stats = [
    {
      title: 'Total Users',
      value: data.totalUsers,
      growth: data.userGrowth,
      icon: Users,
      description: 'from last month'
    },
    {
      title: 'Active Sessions',
      value: data.activeUsers,
      growth: data.activeSessionsGrowth,
      icon: Activity,
      description: 'from yesterday'
    },
    {
      title: 'Avg. Usage Time',
      value: data.avgSessionTime,
      growth: data.usageTimeGrowth,
      icon: Clock,
      description: 'from last week'
    },
    {
      title: 'New Sign Ups',
      value: data.newSignUps,
      growth: data.signupsGrowth,
      icon: UserPlus,
      description: 'from yesterday'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isNegativeGrowth = stat.growth.startsWith('-');
        
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
              </div>
              <div className="flex items-center pt-1 text-xs">
                {isNegativeGrowth ? (
                  <>
                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                    <span className="text-red-500">{stat.growth}</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    <span className="text-green-500">{stat.growth}</span>
                  </>
                )}
                <span className="ml-1 text-gray-500">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
