import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AvatarDisplayProps {
  currentAvatarUrl?: string;
  previewUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  initials?: string;
  isUploading?: boolean;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  currentAvatarUrl,
  previewUrl,
  size = 'lg',
  initials = 'U',
  isUploading = false
}) => {
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-20 w-20', 
    lg: 'h-32 w-32'
  };

  const displayUrl = previewUrl || currentAvatarUrl || '/abstract-user-flat.svg';

  return (
    <div className="relative">
      <Avatar className={cn(sizeClasses[size], "relative overflow-hidden")}>
        <AvatarImage 
          src={displayUrl} 
          alt="Profile picture"
          className="object-cover w-full h-full"
        />
        <AvatarFallback className="bg-muted text-muted-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      {isUploading && (
        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};