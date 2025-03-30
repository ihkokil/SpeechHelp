
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoaderIcon, TrashIcon } from 'lucide-react';
import { useAdminReset } from '@/utils/adminUtils';

interface ResetAdminSectionProps {
  onResetSuccess: () => void;
}

const ResetAdminSection = ({ onResetSuccess }: ResetAdminSectionProps) => {
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState('');
  const { resetAdminUsers } = useAdminReset();

  const handleResetAdminUsers = async () => {
    setIsResetting(true);
    setError('');
    
    try {
      const success = await resetAdminUsers();
      
      if (success) {
        onResetSuccess();
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
      
      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center text-sm mt-3">
          <div className="mr-2 flex-shrink-0">⚠️</div>
          {error}
        </div>
      )}
    </div>
  );
};

export default ResetAdminSection;
