
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminSettings = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveSettings = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Admin Settings</h2>
      
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>
                Manage general platform configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Platform Name</Label>
                  <Input id="site-name" defaultValue="SpeechHelp" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="site-url">Platform URL</Label>
                  <Input id="site-url" defaultValue="https://speechhelp.ai" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Support Email</Label>
                  <Input id="contact-email" defaultValue="support@speechhelp.ai" type="email" />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode" className="block">Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Enable maintenance mode to prevent user access</p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="user-signups" className="block">User Signups</Label>
                    <p className="text-sm text-gray-500">Allow new user registrations</p>
                  </div>
                  <Switch id="user-signups" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="public-visibility" className="block">Public Visibility</Label>
                    <p className="text-sm text-gray-500">Make the platform visible to non-logged-in users</p>
                  </div>
                  <Switch id="public-visibility" defaultChecked />
                </div>
              </div>
              
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure admin security settings and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="block">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Require 2FA for all admin accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="block">Session Timeout</Label>
                    <p className="text-sm text-gray-500">Automatically log out admins after inactivity</p>
                  </div>
                  <Select defaultValue="24h">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="8h">8 hours</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="7d">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="block">Login Attempts</Label>
                    <p className="text-sm text-gray-500">Max failed login attempts before lockout</p>
                  </div>
                  <Select defaultValue="5">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Attempts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Allowed IP Addresses</Label>
                <p className="text-sm text-gray-500">Restrict admin access to specific IP addresses (one per line)</p>
                <Textarea placeholder="e.g. 192.168.1.1" />
              </div>
              
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure email templates and notification settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Email Provider</Label>
                  <Select defaultValue="smtp">
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smtp">SMTP</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-host">SMTP Host</Label>
                      <Input id="smtp-host" placeholder="smtp.example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">SMTP Port</Label>
                      <Input id="smtp-port" placeholder="587" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-user">SMTP Username</Label>
                      <Input id="smtp-user" placeholder="username" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-pass">SMTP Password</Label>
                      <Input id="smtp-pass" type="password" placeholder="••••••••" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Email Notifications</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="notify-signup" defaultChecked />
                      <Label htmlFor="notify-signup">New user registrations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="notify-payment" defaultChecked />
                      <Label htmlFor="notify-payment">New payments</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="notify-contact" defaultChecked />
                      <Label htmlFor="notify-contact">Contact form submissions</Label>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Manage API keys and integration settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>API Keys</Label>
                <div className="p-4 bg-gray-50 rounded-md border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Live API Key</p>
                      <p className="text-sm text-gray-500">Use for production environment</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input 
                        className="font-mono"
                        value="sk_live_•••••••••••••••••••••••••"
                        readOnly
                      />
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Test API Key</p>
                      <p className="text-sm text-gray-500">Use for development and testing</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input 
                        className="font-mono"
                        value="sk_test_•••••••••••••••••••••••••"
                        readOnly
                      />
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="secondary" size="sm">
                      Regenerate Keys
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <Input placeholder="https://your-app.com/api/webhook" />
                  <p className="text-xs text-gray-500">URL that will receive webhook events</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Webhook Secret</Label>
                  <div className="flex gap-2">
                    <Input type="password" placeholder="••••••••••••••••" />
                    <Button variant="outline" size="sm">
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Used to verify webhook signatures</p>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
