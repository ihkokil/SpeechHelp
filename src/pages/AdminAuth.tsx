
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import FirstAdminSetup from '@/components/admin/FirstAdminSetup';
import AuthHeader from '@/components/admin/auth/AuthHeader';
import AuthCard from '@/components/admin/auth/AuthCard';
import LoginForm from '@/components/admin/auth/LoginForm';
import TwoFactorForm from '@/components/admin/auth/TwoFactorForm';
import LoadingScreen from '@/components/admin/auth/LoadingScreen';

const AdminAuth = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [needsFirstTimeSetup, setNeedsFirstTimeSetup] = useState(false);
  const [checkingAdminStatus, setCheckingAdminStatus] = useState(true);
  
  const { toast } = useToast();

  useEffect(() => {
    checkForExistingAdmins();
  }, []);

  const checkForExistingAdmins = async () => {
    try {
      setCheckingAdminStatus(true);
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { method: 'check_admins_exist' }
      });
      
      if (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: "Error",
          description: "Failed to check admin configuration. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      if (data && typeof data.adminsExist === 'boolean') {
        setNeedsFirstTimeSetup(!data.adminsExist);
      } else {
        // Handle unexpected response format
        console.error('Unexpected response format:', data);
        toast({
          title: "Error",
          description: "Received an invalid response from the server. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error checking admin status:', error);
      toast({
        title: "Error",
        description: "Failed to check admin configuration: " + error.message,
        variant: "destructive"
      });
    } finally {
      setCheckingAdminStatus(false);
    }
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
  };

  const handleSetupComplete = () => {
    setNeedsFirstTimeSetup(false);
    toast({
      title: "Setup Complete",
      description: "You can now log in with your new admin credentials.",
    });
  };

  const handleTwoFactorRequired = () => {
    setShowTwoFA(true);
  };

  const handleBackToLogin = () => {
    setShowTwoFA(false);
  };

  if (checkingAdminStatus) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500 p-4">
      {needsFirstTimeSetup ? (
        <FirstAdminSetup onSetupComplete={handleSetupComplete} />
      ) : (
        <div className="w-full max-w-md">
          <AuthHeader />
          
          {!showTwoFA ? (
            <AuthCard
              title="Admin Login"
              description="Enter your admin credentials to access the dashboard"
            >
              <LoginForm 
                onTwoFactorRequired={handleTwoFactorRequired}
                onError={handleError}
              />
            </AuthCard>
          ) : (
            <AuthCard
              title="Two-Factor Authentication"
              description="Enter the verification code from your authenticator app"
            >
              <TwoFactorForm
                onBackToLogin={handleBackToLogin}
                onError={handleError}
              />
            </AuthCard>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminAuth;
