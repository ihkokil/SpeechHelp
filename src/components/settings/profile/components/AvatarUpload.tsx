
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AvatarUploadProps {
  avatarUrl?: string;
  onAvatarChange: (url: string) => void;
  firstName?: string;
  lastName?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  avatarUrl,
  onAvatarChange,
  firstName = '',
  lastName = ''
}) => {
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, GIF).",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 2MB.",
          variant: "destructive",
        });
        return;
      }

      // Create a preview URL for the uploaded image
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onAvatarChange(result);
        toast({
          title: "Avatar updated",
          description: "Your avatar has been updated. Remember to save your changes.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = () => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial || '?';
  };

  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl} alt="Profile avatar" />
        <AvatarFallback className="text-lg">
          {getInitials() !== '?' ? getInitials() : <User className="h-8 w-8" />}
        </AvatarFallback>
      </Avatar>
      <div>
        <label htmlFor="avatar-upload" className="cursor-pointer">
          <Button variant="outline" className="cursor-pointer" asChild>
            <span>
              <Upload className="h-4 w-4 mr-2" />
              Upload Avatar
            </span>
          </Button>
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <p className="text-sm text-muted-foreground mt-1">
          JPG, PNG or GIF. Max size 2MB.
        </p>
      </div>
    </div>
  );
};

export default AvatarUpload;
