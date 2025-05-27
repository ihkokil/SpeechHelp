
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from '../types';
import EditUserForm from './EditUserForm';
import { formatUserDisplayName } from '../management/utils/userDisplayUtils';

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
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };
  
  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User: {user.email}</DialogTitle>
          <DialogDescription>
            Update user account details for {formatUserDisplayName(user)}.
          </DialogDescription>
        </DialogHeader>
        
        <EditUserForm 
          user={user}
          onUserUpdated={onUserUpdated}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
