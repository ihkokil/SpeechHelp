
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { User } from '../types';
import AddUserForm from './AddUserForm';
import { useAddUserForm } from './hooks/useAddUserForm';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: (user: User) => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ 
  open, 
  onOpenChange, 
  onUserAdded 
}) => {
  const { toast } = useToast();
  const { 
    form, 
    isSubmitting, 
    handleSubmit, 
    handleDialogClose, 
    resetForm 
  } = useAddUserForm({ 
    onOpenChange, 
    onUserAdded, 
    toast 
  });

  console.log("AddUserDialog rendered, open state:", open);
  
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
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Enter the details for the new user account.
          </DialogDescription>
        </DialogHeader>
        
        <AddUserForm 
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

export default AddUserDialog;
