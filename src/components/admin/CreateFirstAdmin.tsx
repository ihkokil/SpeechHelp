
import { useState, useEffect } from 'react';
import { CircleAlertIcon, ShieldIcon } from 'lucide-react';
import AdminSignupForm from './AdminSignupForm';
import AdminLoginRedirect from './AdminLoginRedirect';
import { checkAdminExists } from '@/utils/adminUtils';

const CreateFirstAdmin = () => {
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
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center space-y-1 mb-6">
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
  );
};

export default CreateFirstAdmin;
