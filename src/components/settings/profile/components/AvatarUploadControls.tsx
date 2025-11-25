import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X } from 'lucide-react';

interface AvatarUploadControlsProps {
  currentAvatarUrl?: string;
  onAvatarChange: (avatarUrl: string | null) => void;
  onPreviewChange: (previewUrl: string | null) => void;
  onUploadingChange: (isUploading: boolean) => void;
  disabled?: boolean;
}

export const AvatarUploadControls: React.FC<AvatarUploadControlsProps> = ({
  currentAvatarUrl,
  onAvatarChange,
  onPreviewChange,
  onUploadingChange,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (2MB limit as mentioned in the UI)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 2MB.',
        variant: 'destructive',
      });
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    onPreviewChange(objectUrl);

    uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    onUploadingChange(true);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Delete existing avatar if it exists
      if (currentAvatarUrl && currentAvatarUrl.includes(user.id)) {
        await supabase.storage
          .from('images')
          .remove([`${user.id}/avatar.jpg`, `${user.id}/avatar.png`, `${user.id}/avatar.jpeg`, `${user.id}/avatar.webp`]);
      }

      // Upload new image
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      const avatarUrl = data.publicUrl;

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      onAvatarChange(avatarUrl);
      
      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated successfully.',
      });

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
      
      // Revert preview on error
      onPreviewChange(null);
    } finally {
      onUploadingChange(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      // Remove from storage
      if (currentAvatarUrl && currentAvatarUrl.includes(user.id)) {
        await supabase.storage
          .from('images')
          .remove([`${user.id}/avatar.jpg`, `${user.id}/avatar.png`, `${user.id}/avatar.jpeg`, `${user.id}/avatar.webp`]);
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (error) throw error;

      onAvatarChange(null);
      onPreviewChange(null);

      toast({
        title: 'Avatar removed',
        description: 'Your profile picture has been removed.',
      });

    } catch (error) {
      console.error('Error removing avatar:', error);
      toast({
        title: 'Remove failed',
        description: 'Failed to remove avatar. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (disabled) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {currentAvatarUrl ? 'Change Photo' : 'Upload Photo'}
        </Button>
        
        {currentAvatarUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveAvatar}
            className="flex items-center gap-2 text-destructive hover:text-destructive-foreground"
          >
            <X className="h-4 w-4" />
            Remove
          </Button>
        )}
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};