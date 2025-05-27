
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, AlertTriangle, FileText } from 'lucide-react';
import type { DashboardData } from '@/pages/admin/AdminDashboard';

interface RecentActivityProps {
  activities: DashboardData['recentActivities'];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Overview of the latest user activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
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
  );
};

export default RecentActivity;
