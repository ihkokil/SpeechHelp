
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from '@/components/user/UserAvatar';
import UserProfileInfo from '@/components/user/UserProfileInfo';

export const UserProfile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="px-6 py-4 border-b border-gray-100">
      <div className="flex items-center">
        <UserAvatar user={user} size="md" />
        <div className="ml-3">
          <UserProfileInfo user={user} />
        </div>
      </div>
    </div>
  );
};
