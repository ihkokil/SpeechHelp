
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
              className={`flex items-center justify-center py-4 px-8 flex-1 rounded-none transition-colors ${
                activeTab === 'profile' 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="h-5 w-5 mr-2" />
              <span>Profile</span>
            </button>
            
            <button
              onClick={() => setActiveTab('billing')}
              className={`flex items-center justify-center py-4 px-8 flex-1 rounded-none transition-colors ${
                activeTab === 'billing' 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              <span>Billing</span>
            </button>
            
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center justify-center py-4 px-8 flex-1 rounded-none transition-colors ${
                activeTab === 'notifications' 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Bell className="h-5 w-5 mr-2" />
              <span>Notifications</span>
            </button>
            
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center justify-center py-4 px-8 flex-1 rounded-none transition-colors ${
                activeTab === 'security' 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Shield className="h-5 w-5 mr-2" />
              <span>Security</span>
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
