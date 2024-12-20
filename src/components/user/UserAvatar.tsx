
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md', className = '' }) => {
  const metadata = user.user_metadata || {};
  const firstName = metadata.first_name;
  const lastName = metadata.last_name;
  const emailUsername = user.email?.split('@')[0] || '';
  const displayName = firstName || emailUsername;

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return '?';
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage 
        src={metadata.avatar_url || `https://gravatar.com/avatar/${btoa(user.email || '')}?d=mp`}
        alt={displayName}
      />
      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
