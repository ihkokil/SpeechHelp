
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { User } from '../types';
import EditUserForm from './EditUserForm';
import { useEditUserForm } from './hooks/useEditUserForm';

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: (user: User) => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ 
  user, 
  open, 
  onOpenChange, 
  onUserUpdated 
}) => {
  const { toast } = useToast();
  const { 
    form, 
    isSubmitting, 
    handleSubmit, 
    handleDialogClose, 
    resetForm 
  } = useEditUserForm({ 
    onOpenChange, 
    onUserUpdated, 
    toast,
    initialUser: user
  });

  // Initialize form with user data when the dialog opens with a user
  useEffect(() => {
    if (user && open) {
      form.reset({
        email: user.email,
        name: user.user_metadata?.name || '',
        role: user.is_admin ? (user.admin_role || 'admin') : 'user',
        isActive: user.is_active !== false,
      });
    }
  }, [user, open, form]);
  
  // Prevent closing while submitting
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSubmitting) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    
    if (isSubmitting) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isSubmitting]);
  
  if (!user) {
    return null;
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        // Only allow dialog to close if we're not submitting
        if (isSubmitting && !newOpen) {
          return;
        }
        handleDialogClose(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-[525px]" onInteractOutside={(e) => {
        // Prevent close when clicking outside while submitting
        if (isSubmitting) {
          e.preventDefault();
        }
      }}>
        <DialogHeader>
          <DialogTitle>Edit User: {user.email}</DialogTitle>
          <DialogDescription>
            Update user account details.
          </DialogDescription>
        </DialogHeader>
        
        <EditUserForm 
          form={form} 
          isSubmitting={isSubmitting} 
          onSubmit={handleSubmit} 
          onCancel={() => {
            if (!isSubmitting) {
              resetForm();
              onOpenChange(false);
            }
          }} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
