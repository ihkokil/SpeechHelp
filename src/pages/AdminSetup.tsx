
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CircleAlertIcon, ShieldIcon } from 'lucide-react';
import AdminSignupForm from '@/components/admin/AdminSignupForm';
import AdminLoginRedirect from '@/components/admin/AdminLoginRedirect';
import { checkAdminExists } from '@/utils/adminUtils';

const AdminSetup = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminExists, setAdminExists] = useState(false);

  // Check if admin exists on component mount
  useEffect(() => {
    const initAdminStatus = async () => {
      setIsLoading(true);
      try {
        const exists = await checkAdminExists();
        
        if (exists) {
          setAdminExists(true);
          setError('An admin account already exists. Please use the login page or reset admin users below.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    initAdminStatus();
  }, []);

  const handleAdminExistsError = () => {
    setAdminExists(true);
    setError('An admin account already exists. Please use the login page or reset admin users below.');
  };

  const handleResetSuccess = () => {
    setAdminExists(false);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f0ff] p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <img 
                src="/Speech Help - Logo.svg" 
                alt="SpeechHelp Logo" 
                className="h-10"
              />
            </div>
            <h1 className="text-xl font-medium text-[#9c4dcc] mt-2">Admin Portal</h1>
          </div>
        </div>
        
        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-semibold text-gray-800">Create Admin Account</h2>
                <p className="text-gray-500 text-sm">Set up your first administrator account</p>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-purple-500 rounded-full border-t-transparent"></div>
                </div>
              ) : adminExists ? (
                <AdminLoginRedirect 
                  onResetSuccess={handleResetSuccess} 
                  error={error}
                />
              ) : (
                <AdminSignupForm 
                  onAdminExistsError={handleAdminExistsError} 
                />
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
