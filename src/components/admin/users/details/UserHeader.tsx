
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatUserDisplayName, getUserInitials } from '../management/utils/userDisplayUtils';

interface UserHeaderProps {
  user: User;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
  const defaultAvatarUrl = "/abstract-user-flat.svg";
  
  const getEmailHash = (email: string) => {
    // This is not a real MD5 hash, just for demo purposes
    return btoa(email).replace(/[/+=]/g, '');
  };

  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={user.avatar_url || defaultAvatarUrl} />
        <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-xl font-semibold">
          {formatUserDisplayName(user)}
        </h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.email}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="mt-2">
          <Badge variant={user.is_active !== false ? 'default' : 'secondary'}>
            {user.is_active !== false ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>
    </div>
  );
};
