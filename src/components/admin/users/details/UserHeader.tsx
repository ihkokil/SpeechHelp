
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserHeaderProps {
  user: User;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
  const getUserInitials = (user: User) => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }
    
    if (user.user_metadata?.name) {
      return user.user_metadata.name.charAt(0).toUpperCase();
    }

    if (user.user_metadata?.first_name && user.user_metadata?.last_name) {
      return (user.user_metadata.first_name.charAt(0) + user.user_metadata.last_name.charAt(0)).toUpperCase();
    }
    
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  const getEmailHash = (email: string) => {
    // This is not a real MD5 hash, just for demo purposes
    return btoa(email).replace(/[/+=]/g, '');
  };

  const getUserFullName = (user: User) => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    
    if (user.user_metadata?.first_name && user.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    
    if (user.user_metadata?.name) {
      return user.user_metadata.name;
    }
    
    return user.email?.split('@')[0] || 'Unknown User';
  };

  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={`https://gravatar.com/avatar/${getEmailHash(user.email)}?d=mp`} />
        <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-xl font-semibold">
          {getUserFullName(user)}
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
