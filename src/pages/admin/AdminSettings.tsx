
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, CreditCard, Globe, Shield } from 'lucide-react';
import AdminProfileSettings from '@/components/admin/settings/AdminProfileSettings';
import AdminTimezoneSettings from '@/components/admin/settings/AdminTimezoneSettings';
import AdminStripeSettings from '@/components/admin/settings/AdminStripeSettings';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Settings</h2>
        <p className="text-muted-foreground">
          Manage your admin account settings and platform configuration
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="timezone" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Timezone
          </TabsTrigger>
          <TabsTrigger value="stripe" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Stripe Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and upload your avatar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminProfileSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timezone" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Timezone Settings
              </CardTitle>
              <CardDescription>
                Set your timezone to display all times according to your preference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminTimezoneSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stripe" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Stripe Payment Settings
              </CardTitle>
              <CardDescription>
                Configure Stripe API settings for payment processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminStripeSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
