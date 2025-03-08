
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, Clock, Zap } from 'lucide-react';

interface SystemStatusProps {
  status: {
    uptime: string;
    responseTime: string;
    errors: string;
    warnings: number;
  };
}

const SystemStatus: React.FC<SystemStatusProps> = ({ status }) => {
  const getUptimePercentage = (uptime: string): number => {
    return parseFloat(uptime.replace('%', ''));
  };

  const getResponseTimeValue = (responseTime: string): number => {
    return parseInt(responseTime.replace('ms', ''));
  };

  const getErrorRate = (errors: string): number => {
    return parseFloat(errors.replace('%', ''));
  };

  const uptimePercentage = getUptimePercentage(status.uptime);
  const responseTimeMs = getResponseTimeValue(status.responseTime);
  const errorRate = getErrorRate(status.errors);

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return 'text-green-600';
    if (uptime >= 99.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getResponseTimeColor = (time: number) => {
    if (time <= 200) return 'text-green-600';
    if (time <= 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getErrorRateColor = (rate: number) => {
    if (rate <= 0.1) return 'text-green-600';
    if (rate <= 1.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const systemMetrics = [
    {
      label: 'Uptime',
      value: status.uptime,
      icon: CheckCircle,
      color: getUptimeColor(uptimePercentage),
      progress: uptimePercentage
    },
    {
      label: 'Response Time',
      value: status.responseTime,
      icon: Zap,
      color: getResponseTimeColor(responseTimeMs),
      progress: Math.max(0, 100 - (responseTimeMs / 10))
    },
    {
      label: 'Error Rate',
      value: status.errors,
      icon: AlertTriangle,
      color: getErrorRateColor(errorRate),
      progress: Math.max(0, 100 - (errorRate * 10))
    }
  ];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          System Status
        </CardTitle>
        <CardDescription>Real-time system performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {systemMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                <span className={`text-sm font-semibold ${metric.color}`}>
                  {metric.value}
                </span>
              </div>
              <Progress 
                value={metric.progress} 
                className="h-2"
              />
            </div>
          );
        })}
        
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Active Warnings</span>
            <Badge variant={status.warnings > 0 ? "destructive" : "default"}>
              {status.warnings} warnings
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
