
import { useState, useEffect } from 'react';
import { User, CreditCard, Bell, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import SpeechLabLayout from '@/components/layouts/SpeechLabLayout';
import ProfileSettings from '@/components/settings/ProfileSettings';
import BillingSettings from '@/components/settings/BillingSettings';
import NotificationsSettings from '@/components/settings/NotificationsSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { refreshUser } = useAuth();

  // Check for success parameter and trigger subscription verification
  useEffect(() => {
    const verifyPurchase = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const successParam = urlParams.get('success');
      const sessionId = urlParams.get('session_id');

      if (successParam === 'true' && sessionId) {
        try {
          console.log('Verifying purchase with session:', sessionId);
          
          // Call the verification function
          const { data, error } = await supabase.functions.invoke('stripe-verify', {
            body: { sessionId }
          });

          if (error) {
            console.error('Verification error:', error);
            toast({
              title: "Verification Error",
              description: "There was an issue verifying your payment. Please contact support if this persists.",
              variant: "destructive"
            });
          } else if (data?.success) {
            console.log('Purchase verified successfully:', data);
            
            // Force refresh the user's auth session and profile
            await refreshUser();
            
            toast({
              title: "Payment Successful!",
              description: `Your ${data.planType} subscription has been activated successfully!`,
            });
            
            // Switch to billing tab to show updated info
            setActiveTab('billing');
            
            // Refresh the page after a short delay to ensure all state is updated
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            console.log('Purchase verification failed:', data);
            toast({
              title: "Payment Processing",
              description: "Your payment is being processed. Please check back in a few minutes.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Error verifying purchase:', error);
          toast({
            title: "Verification Error",
            description: "Failed to verify your payment. Please contact support.",
            variant: "destructive"
          });
        }

        // Clean up URL parameters
        window.history.replaceState({}, document.title, '/settings');
      }
    };

    verifyPurchase();
  }, [toast, refreshUser]);

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
