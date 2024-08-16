
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { User } from '../types';

interface DeleteUserDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  users?: User[];
  isLoading: boolean;
  selectedCount?: number;
}

export const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  open,
  onClose,
  onConfirm,
  users = [],
  isLoading,
  selectedCount = 0
}) => {
  const userCount = users.length || selectedCount;
  const isSingleUser = userCount === 1;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isSingleUser ? 'Delete User' : 'Delete Users'}</DialogTitle>
          <DialogDescription>
            {isSingleUser
              ? `Are you sure you want to delete ${users[0]?.email || 'this user'}? This action cannot be undone.`
              : `Are you sure you want to delete ${userCount} selected users? This action cannot be undone.`
            }
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
