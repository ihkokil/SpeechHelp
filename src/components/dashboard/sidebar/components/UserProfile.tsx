
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
  const defaultAvatarUrl = "/abstract-user-flat.svg";
  
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

  // Split long names into two lines
  const splitNameForDisplay = (name: string) => {
    if (name.length <= 20) return { firstLine: name, secondLine: null };
    
    const words = name.split(' ');
    if (words.length === 1) {
      // Single long word - show first part with ellipsis
      return { firstLine: name.slice(0, 15) + '...', secondLine: null };
    }
    
    // Multiple words - try to split reasonably
    const midPoint = Math.ceil(words.length / 2);
    const firstLine = words.slice(0, midPoint).join(' ');
    const secondLine = words.slice(midPoint).join(' ');
    
    return { firstLine, secondLine };
  };

  const { firstLine, secondLine } = splitNameForDisplay(fullName);

  return (
    <div className="px-6 py-4 border-b border-gray-100">
      <div className="flex items-center gap-3">
        {/* Fixed width container for avatar - always visible */}
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center">
            <img 
              src={avatarUrl} 
              alt="User avatar" 
              className="w-10 h-10 object-cover rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== defaultAvatarUrl) {
                  target.src = defaultAvatarUrl;
                }
              }}
            />
          </div>
        </div>
        
        {/* Flexible text container */}
        <div className="flex-1 min-w-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <p className="text-sm font-medium text-gray-900 truncate leading-tight">
                    {firstLine}
                  </p>
                  {secondLine && (
                    <p className="text-sm font-medium text-gray-900 truncate leading-tight">
                      {secondLine}
                    </p>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{fullName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-gray-500 truncate cursor-help">{user?.email}</p>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{user?.email}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
