
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';

const DashboardCharts: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>New user registrations over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <BarChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">Chart will be displayed here with real data</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Distribution</CardTitle>
          <CardDescription>User actions by category</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <BarChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">Chart will be displayed here with real data</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
