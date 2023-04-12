
import { useState } from 'react';
import SpeechLabLayout from '@/components/layouts/SpeechLabLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettings from '@/components/settings/ProfileSettings';
import BillingSettings from '@/components/settings/BillingSettings';
import NotificationsSettings from '@/components/settings/NotificationsSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';

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
          <TabsList className="bg-gray-100">
            <TabsTrigger value="profile">
              {t('settings.tabs.profile', currentLanguage.code)}
            </TabsTrigger>
            <TabsTrigger value="billing">
              {t('settings.tabs.billing', currentLanguage.code)}
            </TabsTrigger>
            <TabsTrigger value="notifications">
              {t('settings.tabs.notifications', currentLanguage.code)}
            </TabsTrigger>
            <TabsTrigger value="security">
              {t('settings.tabs.security', currentLanguage.code)}
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
