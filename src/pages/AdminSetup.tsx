
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldIcon } from 'lucide-react';
import AdminStatusChecker from '@/components/admin/AdminStatusChecker';
import CreateAdminSection from '@/components/admin/CreateAdminSection';
import ResetAdminSection from '@/components/admin/ResetAdminSection';
import LoginRedirectSection from '@/components/admin/LoginRedirectSection';
import AdminSetupLogo from '@/components/admin/AdminSetupLogo';

const AdminSetup = () => {
  const [adminExists, setAdminExists] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleAdminExists = (exists: boolean) => {
    setAdminExists(exists);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleCreateSuccess = () => {
    setSuccess(true);
  };

  const handleResetSuccess = () => {
    setResetSuccess(true);
    setAdminExists(false);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f0ff] p-4">
      <div className="w-full max-w-md">
        <AdminSetupLogo />
        
        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-semibold text-gray-800">Admin Account Setup</h2>
                <p className="text-gray-500 text-sm">Set up your administrator account</p>
              </div>
              
              <AdminStatusChecker 
                onAdminExists={handleAdminExists} 
                onError={handleError}
                onResetSuccess={handleResetSuccess}
                resetSuccess={resetSuccess}
              />
              
              {success ? (
                <CreateAdminSection onSuccess={handleCreateSuccess} />
              ) : adminExists && !resetSuccess ? (
                <div className="space-y-4">
                  <LoginRedirectSection />
                  <ResetAdminSection onResetSuccess={handleResetSuccess} />
                </div>
              ) : (
                <div className="space-y-4">
                  <CreateAdminSection onSuccess={handleCreateSuccess} />
                  <ResetAdminSection onResetSuccess={handleResetSuccess} />
                </div>
              )}
              
              <div className="flex items-center justify-center text-xs text-gray-500 mt-6 gap-1">
                <ShieldIcon className="h-3 w-3" />
                <span>Use this option only for the initial setup of your admin portal</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSetup;
