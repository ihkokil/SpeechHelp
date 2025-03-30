
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PaymentMethod } from './types';

interface DeletePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  isProcessing: boolean;
  paymentMethod?: PaymentMethod;
}

const DeletePaymentDialog = ({ 
  open, 
  onOpenChange, 
  onDelete, 
  isProcessing, 
  paymentMethod 
}: DeletePaymentDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
          <AlertDialogDescription>
            {paymentMethod ? (
              <>
                Are you sure you want to delete your {paymentMethod.brand} card 
                ending in {paymentMethod.last4}? This action cannot be undone.
              </>
            ) : (
              "Are you sure you want to delete this payment method? This action cannot be undone."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-red-500 hover:bg-red-600 text-white" 
            onClick={onDelete}
            disabled={isProcessing}
          >
            {isProcessing ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePaymentDialog;
