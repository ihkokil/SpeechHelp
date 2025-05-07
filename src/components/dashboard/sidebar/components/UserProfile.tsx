
import { useAuth } from '@/contexts/AuthContext';
import { Tooltip } from '@/components/ui/tooltip';

export const UserProfile = () => {
  const { user } = useAuth();
  const metadata = user?.user_metadata || {};
  const firstName = metadata.first_name;
  const lastName = metadata.last_name;
  const emailUsername = user?.email?.split('@')[0] || '';
  const displayName = firstName || emailUsername;
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : displayName;

  return (
    <div className="px-6 py-4 border-b border-gray-100">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
          {user?.email ? user.email[0].toUpperCase() : '?'}
        </div>
        <div className="ml-3 overflow-hidden">
          <p className="text-sm font-medium text-gray-900 truncate">{fullName}</p>
          <Tooltip content={user?.email || ''}>
            <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</p>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
