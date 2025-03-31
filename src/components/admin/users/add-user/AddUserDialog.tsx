
import React from 'react';
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
  
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[525px]">
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
