
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserProfileInfoProps {
  user: User;
  showEmail?: boolean;
  className?: string;
}

const UserProfileInfo: React.FC<UserProfileInfoProps> = ({ 
  user, 
  showEmail = true, 
  className = '' 
}) => {
  const metadata = user.user_metadata || {};
  const firstName = metadata.first_name || '';
  const lastName = metadata.last_name || '';
  const emailUsername = user.email?.split('@')[0] || '';
  
  const displayName = firstName || emailUsername;
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : displayName;

  return (
    <div className={`flex flex-col ${className}`}>
      <p className="text-sm font-medium text-gray-900 truncate">{fullName}</p>
      {showEmail && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-xs text-gray-500 truncate cursor-help">{user.email}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.email}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default UserProfileInfo;
