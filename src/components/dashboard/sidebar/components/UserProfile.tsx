
import { useAuth } from '@/contexts/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { profileService } from '@/services/profileService';

export const UserProfile = () => {
  const { user, profile } = useAuth();
  
  // Use profile service to get consistent display name
  const displayName = profileService.getDisplayName(profile, user || undefined);
  
  // Use profile first, fallback to user metadata
  const fullName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : displayName;

  // Add debug logging for the current user's profile data
  if (user) {
    console.log('👤 Current user profile data:', {
      userId: user.id,
      email: user.email,
      profile: profile,
      displayName,
      fullName
    });
  }

  return (
    <div className="px-6 py-4 border-b border-gray-100">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
          {user?.email ? user.email[0].toUpperCase() : '?'}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900 truncate">{fullName}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user?.email}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
