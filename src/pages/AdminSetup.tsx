
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CircleAlertIcon, ShieldIcon, CheckCircleIcon, LoaderIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { checkAdminExists, createDefaultAdmin, useAdminReset } from '@/utils/adminUtils';
import { useToast } from '@/hooks/use-toast';

const AdminSetup = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState('');
  const [adminExists, setAdminExists] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { resetAdminUsers } = useAdminReset();

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

  const handleCreateAdmin = async () => {
    setIsCreating(true);
    setError('');
    
    try {
      const result = await createDefaultAdmin();
      
      if (result.success) {
        setSuccess(true);
        toast({
          title: "Admin account created",
          description: "Default admin account has been created successfully.",
        });
        
        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);
      } else {
        setError(result.error || 'Failed to create admin account');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  const handleResetAdminUsers = async () => {
    setIsResetting(true);
    setError('');
    
    try {
      const success = await resetAdminUsers();
      
      if (success) {
        setResetSuccess(true);
        setAdminExists(false);
        setError('');
        toast({
          title: "Admin users reset",
          description: "All admin users have been deleted. You can now create a new admin account.",
        });
      } else {
        setError('Failed to reset admin users');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsResetting(false);
    }
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
                <h2 className="text-2xl font-semibold text-gray-800">Admin Account Setup</h2>
                <p className="text-gray-500 text-sm">Set up your administrator account</p>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-purple-500 rounded-full border-t-transparent"></div>
                </div>
              ) : adminExists && !resetSuccess ? (
                <div className="space-y-4">
                  {error && (
                    <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center text-sm mb-4">
                      <CircleAlertIcon className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-600 mb-4">An admin account already exists. You can log in or reset all admin accounts below.</p>
                    <Link 
                      to="/admin/login" 
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white rounded-md mb-4"
                    >
                      Go to Login
                    </Link>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-700 font-medium mb-2">Reset Admin Users</p>
                      <p className="text-xs text-gray-500 mb-3">This will delete all existing admin accounts, allowing you to create a new one.</p>
                      
                      <Button 
                        onClick={handleResetAdminUsers}
                        variant="destructive"
                        className="w-full flex items-center justify-center"
                        disabled={isResetting}
                      >
                        {isResetting ? (
                          <span className="flex items-center">
                            <LoaderIcon className="animate-spin mr-2 h-4 w-4" />
                            Resetting Admin Users...
                          </span>
                        ) : (
                          <>
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Reset Admin Users
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : success ? (
                <div className="space-y-4">
                  <div className="bg-green-50 text-green-800 p-4 rounded-md flex items-center text-sm">
                    <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 text-green-500" />
                    <div>
                      <p className="font-medium">Admin account created successfully!</p>
                      <p className="mt-1">Username: admin</p>
                      <p>Password: Admin123!</p>
                      <p className="mt-2 text-xs">You will be redirected to the login page in a few seconds...</p>
                    </div>
                  </div>
                  
                  <div className="text-center pt-2">
                    <Link 
                      to="/admin/login" 
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white rounded-md"
                    >
                      Go to Login
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {error && (
                    <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center text-sm mb-4">
                      <CircleAlertIcon className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  {resetSuccess && (
                    <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center text-sm mb-4">
                      <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 text-green-500" />
                      <span>All admin users have been reset successfully. You can now create a new admin account.</span>
                    </div>
                  )}
                  
                  <div className="text-center space-y-2 py-2">
                    <p className="text-sm text-gray-600">Click the button below to create a default admin account with these credentials:</p>
                    <div className="bg-gray-50 p-3 rounded-md text-sm text-left">
                      <p><span className="font-medium">Username:</span> admin</p>
                      <p><span className="font-medium">Password:</span> Admin123!</p>
                      <p><span className="font-medium">Email:</span> admin@speechhelp.ai</p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCreateAdmin}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <span className="flex items-center">
                        <LoaderIcon className="animate-spin mr-2 h-4 w-4" />
                        Creating Admin Account...
                      </span>
                    ) : (
                      "Create Default Admin Account"
                    )}
                  </Button>
                  
                  {/* Add a reset button here too, in case admin exists but the check failed */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-700 font-medium mb-2">Reset Admin Users</p>
                    <p className="text-xs text-gray-500 mb-3">If you're getting errors about admin users already existing, use this button to reset all admin accounts.</p>
                    
                    <Button 
                      onClick={handleResetAdminUsers}
                      variant="destructive"
                      className="w-full flex items-center justify-center"
                      disabled={isResetting}
                    >
                      {isResetting ? (
                        <span className="flex items-center">
                          <LoaderIcon className="animate-spin mr-2 h-4 w-4" />
                          Resetting Admin Users...
                        </span>
                      ) : (
                        <>
                          <TrashIcon className="w-4 h-4 mr-2" />
                          Reset Admin Users
                        </>
                      )}
                    </Button>
                  </div>
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
