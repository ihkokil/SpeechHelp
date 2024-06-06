
import { useState } from 'react';
import { User, CreditCard, Bell, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import SpeechLabLayout from '@/components/layouts/SpeechLabLayout';
import ProfileSettings from '@/components/settings/ProfileSettings';
import BillingSettings from '@/components/settings/BillingSettings';
import NotificationsSettings from '@/components/settings/NotificationsSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <SpeechLabLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Account Settings
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your account settings and preferences
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex flex-wrap">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center py-4 px-6 flex-1 ${
                activeTab === 'profile' 
                  ? 'bg-purple-500 text-white rounded-t-xl' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="h-5 w-5 mb-1" />
              <span className="text-sm">Profile</span>
            </button>
            
            <button
              onClick={() => setActiveTab('billing')}
              className={`flex flex-col items-center justify-center py-4 px-6 flex-1 ${
                activeTab === 'billing' 
                  ? 'bg-purple-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="h-5 w-5 mb-1" />
              <span className="text-sm">Billing</span>
            </button>
            
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex flex-col items-center justify-center py-4 px-6 flex-1 ${
                activeTab === 'notifications' 
                  ? 'bg-purple-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Bell className="h-5 w-5 mb-1" />
              <span className="text-sm">Notifications</span>
            </button>
            
            <button
              onClick={() => setActiveTab('security')}
              className={`flex flex-col items-center justify-center py-4 px-6 flex-1 ${
                activeTab === 'security' 
                  ? 'bg-purple-500 text-white rounded-t-xl' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Shield className="h-5 w-5 mb-1" />
              <span className="text-sm">Security</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'billing' && <BillingSettings />}
          {activeTab === 'notifications' && <NotificationsSettings />}
          {activeTab === 'security' && <SecuritySettings />}
        </div>
      </div>
    </SpeechLabLayout>
  );
};

export default Settings;
