
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardData } from '@/pages/admin/AdminDashboard';

interface SystemStatusProps {
  status: DashboardData['systemStatus'];
}

const SystemStatus: React.FC<SystemStatusProps> = ({ status }) => {
  const statusItems = [
    { label: 'Uptime', value: status.uptime, color: 'text-green-500' },
    { label: 'Avg. Response Time', value: status.responseTime, color: 'text-gray-900' },
    { label: 'Error Rate', value: status.errors, color: 'text-gray-900' },
    { label: 'Active Warnings', value: status.warnings.toString(), color: 'text-amber-500' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Current service performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusItems.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-sm font-medium">{item.label}</span>
              <span className={`text-sm ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
