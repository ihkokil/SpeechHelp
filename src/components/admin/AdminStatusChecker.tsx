
import { useState, useEffect } from 'react';
import { CheckCircleIcon, CircleAlertIcon, LoaderIcon } from 'lucide-react';
import { checkAdminExists } from '@/utils/adminUtils';

interface AdminStatusCheckerProps {
  onAdminExists: (exists: boolean) => void;
  onError: (error: string) => void;
  onResetSuccess: () => void;
  resetSuccess: boolean;
}

const AdminStatusChecker = ({ 
  onAdminExists, 
  onError, 
  onResetSuccess, 
  resetSuccess 
}: AdminStatusCheckerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initAdminStatus = async () => {
      setIsLoading(true);
      try {
        const exists = await checkAdminExists();
        
        onAdminExists(exists);
        
        if (exists) {
          const errorMsg = 'An admin account already exists. Please use the login page or reset admin users below.';
          setError(errorMsg);
          onError(errorMsg);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        const errorMsg = 'Error checking for existing admin accounts. You can try resetting admin users below.';
        setError(errorMsg);
        onError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAdminStatus();
  }, [onAdminExists, onError]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-6 w-6 border-2 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error && !resetSuccess) {
    return (
      <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center text-sm mb-4">
        <CircleAlertIcon className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
        <span>{error}</span>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center text-sm mb-4">
        <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 text-green-500" />
        <span>All admin users have been reset successfully. You can now create a new admin account.</span>
      </div>
    );
  }

  return null;
};

export default AdminStatusChecker;
