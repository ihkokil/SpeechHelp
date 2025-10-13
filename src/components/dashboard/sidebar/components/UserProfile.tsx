
import { useAuth } from '@/contexts/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { profileService } from '@/services/profileService';
import { UserCircle } from 'lucide-react';

export const UserProfile = () => {
  const { user, profile } = useAuth();
  
  // Use profile service to get consistent display name
  const displayName = profileService.getDisplayName(profile, user || undefined);
  
  // Use profile first, fallback to user metadata
  const fullName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : displayName;

  // Default avatar URL
  const defaultAvatarUrl = "https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/images//user-account.svg";
  
  // Get avatar URL from profile or use default
  const avatarUrl = profile?.avatar_url || defaultAvatarUrl;

  // Add debug logging for the current user's profile data
  if (user) {
    console.log('👤 Current user profile data:', {
      userId: user.id,
      email: user.email,
      profile: profile,
      displayName,
      fullName,
      avatarUrl
    });
  }

  return (
    <div className="px-6 py-4 border-b border-gray-100">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full overflow-hidden relative flex items-center justify-center">
          {/* Custom pink and purple user icon */}
          <UserCircle className="h-full w-full text-pink-500" />
          {/* Purple head overlay */}
          <div className="absolute top-0 left-0 w-full h-4 overflow-hidden">
            <UserCircle className="h-full w-full text-purple-500 scale-110" />
          </div>
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
