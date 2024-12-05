
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { adminSettingsService } from '@/services/adminSettingsService';

const timezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
];

const AdminTimezoneSettings = () => {
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load timezone data on component mount
  useEffect(() => {
    loadTimezoneData();
  }, []);

  const loadTimezoneData = async () => {
    setIsLoadingData(true);
    try {
      const timezone = await adminSettingsService.getSetting('timezone');
      if (timezone) {
        setSelectedTimezone(timezone);
      }
    } catch (error) {
      console.error('Error loading timezone data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await adminSettingsService.saveSetting('timezone', selectedTimezone, 'timezone');
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Store in localStorage for immediate use
      localStorage.setItem('admin_timezone', selectedTimezone);
      
      toast({
        title: "Timezone updated",
        description: `Timezone has been set to ${timezones.find(tz => tz.value === selectedTimezone)?.label}`,
      });
    } catch (error: any) {
      console.error('Error saving timezone:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update timezone. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString('en-US', {
      timeZone: selectedTimezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  if (isLoadingData) {
    return <div className="flex items-center justify-center p-8">Loading timezone data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="timezone">Select Timezone</Label>
        <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
          <SelectTrigger>
            <SelectValue placeholder="Select your timezone" />
          </SelectTrigger>
          <SelectContent>
            {timezones.map((timezone) => (
              <SelectItem key={timezone.value} value={timezone.value}>
                {timezone.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            Current Time Preview
          </CardTitle>
          <CardDescription>
            This is how times will be displayed throughout the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-mono bg-muted p-3 rounded-md">
            {getCurrentTime()}
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Changing your timezone will affect how all dates and times are displayed 
          throughout the admin dashboard, including user activity logs, subscription dates, and system timestamps.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Timezone"}
        </Button>
      </div>
    </div>
  );
};

export default AdminTimezoneSettings;
