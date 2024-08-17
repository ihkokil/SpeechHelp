
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export interface DeleteUserDialogProps {
  open?: boolean;
  isOpen?: boolean; // For backward compatibility
  onOpenChange?: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  selectedCount?: number;
}

export const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  open,
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading = false,
  selectedCount = 0,
}) => {
  // Use either open or isOpen prop (for backward compatibility)
  const isDialogOpen = open !== undefined ? open : isOpen;
  
  // Handle dialog state change
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {selectedCount > 1 ? `${selectedCount} Users` : 'User'}</AlertDialogTitle>
          <AlertDialogDescription>
            {selectedCount > 1
              ? `Are you sure you want to delete these ${selectedCount} users? This action cannot be undone.`
              : "Are you sure you want to delete this user? This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
