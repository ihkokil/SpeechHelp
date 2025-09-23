
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { User } from '../../types';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';

interface DeleteUserConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  user: User | null;
  isDeleting: boolean;
}

export const DeleteUserConfirmDialog: React.FC<DeleteUserConfirmDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  user,
  isDeleting
}) => {
  const { translate } = useTranslatedContent();

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Delete User Account
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                This action cannot be undone
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <div className="rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-800 mb-2">
              You are about to permanently delete:
            </p>
            <div className="space-y-1">
              <p className="font-medium text-red-900">{user.email}</p>
              {user.username && (
                <p className="text-sm text-red-700">{user.username}</p>
              )}
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p className="font-medium mb-2">This will permanently delete:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>User account and profile information</li>
              <li>All user-created speeches and content</li>
              <li>Payment methods and billing history</li>
              <li>Two-factor authentication settings</li>
              <li>All associated user data</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isDeleting}
            className="min-w-[100px]"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete User'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
