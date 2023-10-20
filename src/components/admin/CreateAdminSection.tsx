
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, LoaderIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createDefaultAdmin } from '@/utils/adminUtils';
import { useToast } from '@/hooks/use-toast';

interface CreateAdminSectionProps {
  onSuccess: () => void;
}

const CreateAdminSection = ({ onSuccess }: CreateAdminSectionProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateAdmin = async () => {
    setIsCreating(true);
    setError('');
    
    try {
      const result = await createDefaultAdmin();
      
      if (result.success) {
        setSuccess(true);
        onSuccess();
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

  if (success) {
    return (
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
    );
  }

  return (
    <div className="space-y-4">
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
      
      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center text-sm mb-4">
          <div className="mr-2 flex-shrink-0">⚠️</div>
          {error}
        </div>
      )}
    </div>
  );
};

export default CreateAdminSection;
