
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { BellRing, Mail, MessageSquare, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NotificationsSettings = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifications, setNotifications] = useState({
    email: {
      newFeatures: true,
      speechReminders: true,
      tips: true,
      newsletter: false,
    },
    push: {
      newFeatures: true,
      speechReminders: true,
      accountActivity: true,
    }
  });

  const handleToggle = (category: 'email' | 'push', notification: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [notification]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // In a real app, you would call your backend API to save notification preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving notification preferences:', notifications);
      
      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast({
        title: "Save failed",
        description: "There was a problem saving your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-pink-600" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Manage the emails you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium">New Features & Updates</h4>
                <p className="text-sm text-gray-500">Get notified about new features and updates</p>
              </div>
              <Switch 
                checked={notifications.email.newFeatures} 
                onCheckedChange={(checked) => handleToggle('email', 'newFeatures', checked)}
                className="data-[state=checked]:bg-pink-600"
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium">Speech Reminders</h4>
                <p className="text-sm text-gray-500">Receive reminders about upcoming speeches</p>
              </div>
              <Switch 
                checked={notifications.email.speechReminders} 
                onCheckedChange={(checked) => handleToggle('email', 'speechReminders', checked)}
                className="data-[state=checked]:bg-pink-600"
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium">Tips & Advice</h4>
                <p className="text-sm text-gray-500">Get helpful tips to improve your speeches</p>
              </div>
              <Switch 
                checked={notifications.email.tips} 
                onCheckedChange={(checked) => handleToggle('email', 'tips', checked)}
                className="data-[state=checked]:bg-pink-600"
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium">Newsletter</h4>
                <p className="text-sm text-gray-500">Receive our monthly newsletter</p>
              </div>
              <Switch 
                checked={notifications.email.newsletter} 
                onCheckedChange={(checked) => handleToggle('email', 'newsletter', checked)}
                className="data-[state=checked]:bg-pink-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BellRing className="h-5 w-5 mr-2 text-pink-600" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Manage your push notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-start">
                <MessageSquare className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">New Features & Updates</h4>
                  <p className="text-sm text-gray-500">Stay informed about new app features</p>
                </div>
              </div>
              <Switch 
                checked={notifications.push.newFeatures} 
                onCheckedChange={(checked) => handleToggle('push', 'newFeatures', checked)}
                className="data-[state=checked]:bg-pink-600"
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Speech Reminders</h4>
                  <p className="text-sm text-gray-500">Get notified about speech deadlines</p>
                </div>
              </div>
              <Switch 
                checked={notifications.push.speechReminders} 
                onCheckedChange={(checked) => handleToggle('push', 'speechReminders', checked)}
                className="data-[state=checked]:bg-pink-600"
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-start">
                <BellRing className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Account Activity</h4>
                  <p className="text-sm text-gray-500">Get important account notifications</p>
                </div>
              </div>
              <Switch 
                checked={notifications.push.accountActivity} 
                onCheckedChange={(checked) => handleToggle('push', 'accountActivity', checked)}
                className="data-[state=checked]:bg-pink-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
};

export default NotificationsSettings;
