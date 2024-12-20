
import { LogOutIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LogoutButton = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    navigate('/');
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <button
        onClick={handleSignOut}
        className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors"
      >
        <LogOutIcon className="h-5 w-5 mr-3" />
        Logout
      </button>
    </div>
  );
};
