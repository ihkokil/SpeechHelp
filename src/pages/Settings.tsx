
import { useState } from 'react';
import SpeechLabLayout from '@/components/layouts/SpeechLabLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettings from '@/components/settings/ProfileSettings';
import BillingSettings from '@/components/settings/BillingSettings';
import NotificationsSettings from '@/components/settings/NotificationsSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { User, CreditCard, Bell, Shield } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <SpeechLabLayout>
      <div className="p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('settings.title', currentLanguage.code)}
          </h1>
          <p className="text-gray-500 mt-1">
            {t('settings.subtitle', currentLanguage.code)}
          </p>
        </header>

        <Tabs defaultValue="profile" onValueChange={setActiveTab} value={activeTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl bg-gradient-to-r from-pink-500 via-pink-500 to-purple-600 p-1 rounded-lg">
            <TabsTrigger 
              value="profile" 
              className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md rounded-md transition-all"
            >
              <User className="h-5 w-5" />
              <span>{t('settings.tabs.profile', currentLanguage.code)}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md rounded-md transition-all"
            >
              <CreditCard className="h-5 w-5" />
              <span>{t('settings.tabs.billing', currentLanguage.code)}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md rounded-md transition-all"
            >
              <Bell className="h-5 w-5" />
              <span>{t('settings.tabs.notifications', currentLanguage.code)}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md rounded-md transition-all"
            >
              <Shield className="h-5 w-5" />
              <span>{t('settings.tabs.security', currentLanguage.code)}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="billing" className="mt-6">
            <BillingSettings />
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <NotificationsSettings />
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
      </div>
    </SpeechLabLayout>
  );
};

export default Settings;
