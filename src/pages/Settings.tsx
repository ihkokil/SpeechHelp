
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettings from '@/components/settings/ProfileSettings';
import BillingSettings from '@/components/settings/BillingSettings';
import NotificationsSettings from '@/components/settings/NotificationsSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { User, CreditCard, Bell, Shield } from 'lucide-react';
import SpeechLabLayout from '@/components/layouts/SpeechLabLayout';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <SpeechLabLayout>
      <div className="max-w-6xl mx-auto px-4 py-8 mt-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('settings.title', currentLanguage.code)}
          </h1>
          <p className="text-gray-500 mt-1">
            {t('settings.subtitle', currentLanguage.code)}
          </p>
        </header>

        <Tabs defaultValue="profile" onValueChange={setActiveTab} value={activeTab} className="space-y-8">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <TabsList className="flex w-full max-w-2xl rounded-lg overflow-hidden h-16 p-1.5 bg-gray-100">
              <TabsTrigger 
                value="profile" 
                className="flex-1 flex flex-col items-center justify-center gap-1.5 h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:via-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all"
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">{t('settings.tabs.profile', currentLanguage.code)}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="flex-1 flex flex-col items-center justify-center gap-1.5 h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:via-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all"
              >
                <CreditCard className="h-5 w-5" />
                <span className="text-sm font-medium">{t('settings.tabs.billing', currentLanguage.code)}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="flex-1 flex flex-col items-center justify-center gap-1.5 h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:via-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all"
              >
                <Bell className="h-5 w-5" />
                <span className="text-sm font-medium">{t('settings.tabs.notifications', currentLanguage.code)}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="flex-1 flex flex-col items-center justify-center gap-1.5 h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:via-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all"
              >
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">{t('settings.tabs.security', currentLanguage.code)}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="bg-white p-6 rounded-xl shadow-sm mt-6">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="billing" className="bg-white p-6 rounded-xl shadow-sm mt-6">
            <BillingSettings />
          </TabsContent>

          <TabsContent value="notifications" className="bg-white p-6 rounded-xl shadow-sm mt-6">
            <NotificationsSettings />
          </TabsContent>

          <TabsContent value="security" className="bg-white p-6 rounded-xl shadow-sm mt-6">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
      </div>
    </SpeechLabLayout>
  );
};

export default Settings;
