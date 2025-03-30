
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, TrashIcon, AlertCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { useAdminReset } from '@/utils/adminUtils';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginRedirectProps {
  onResetSuccess: () => void;
  error: string;
}

const AdminLoginRedirect = ({ onResetSuccess, error }: AdminLoginRedirectProps) => {
  const [isDeletingAdmin, setIsDeletingAdmin] = useState(false);
  const [resetResult, setResetResult] = useState<{success: boolean; message?: string}>({success: false});
  const { resetAdminUsers } = useAdminReset();
  const { toast } = useToast();

  const handleDeleteAllAdmins = async () => {
    setIsDeletingAdmin(true);
    setResetResult({success: false});
    
    try {
      const success = await resetAdminUsers();
      
      setResetResult({
        success: success,
        message: success 
          ? 'All admin accounts have been deleted. You can now create a new admin account.'
          : 'Failed to reset admin accounts. Please try again.'
      });
      
      if (success) {
        onResetSuccess();
      }
    } finally {
      setIsDeletingAdmin(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center text-sm mb-4">
          <AlertCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
      
      {resetResult.success && (
        <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center text-sm mb-4">
          <div className="mr-2 flex-shrink-0">✅</div>
          <span>{resetResult.message}</span>
        </div>
      )}
      
      {resetResult.success ? (
        <div className="text-center py-2">
          <p className="text-sm text-gray-600 mb-4">You can now create a new admin account.</p>
        </div>
      ) : (
        <div className="text-center">
          <Link 
            to="/admin/login" 
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white rounded-md"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Go to Login
          </Link>
        </div>
      )}
      
      <div className="border-t border-gray-100 pt-4 mt-4">
        <div className="text-center mb-3">
          <p className="text-sm text-gray-600 font-medium">Reset Admin Users</p>
          <p className="text-xs text-gray-500 mt-1">This will delete all existing admin users, allowing you to create a new one.</p>
        </div>
        <Button 
          onClick={handleDeleteAllAdmins}
          variant="destructive"
          className="w-full flex items-center justify-center"
          disabled={isDeletingAdmin}
        >
          <TrashIcon className="w-4 h-4 mr-2" />
          {isDeletingAdmin ? "Resetting..." : "Reset Admin Users"}
        </Button>
      </div>
    </div>
  );
};

export default AdminLoginRedirect;
