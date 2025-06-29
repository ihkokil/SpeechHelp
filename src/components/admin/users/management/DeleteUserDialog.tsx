
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';

interface DeleteUserDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
  selectedCount: number;
}

export const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading,
  selectedCount
}) => {
  const { translate } = useTranslatedContent();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{translate('admin.delete.title')}</DialogTitle>
          <DialogDescription>
            {translate('admin.delete.description', { count: selectedCount.toString() })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {translate('admin.delete.cancel')}
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => onConfirm()}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {translate('admin.delete.deleting')}
              </>
            ) : (
              translate('admin.delete.confirm')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
