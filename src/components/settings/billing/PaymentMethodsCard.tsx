import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PaymentMethodItem from './PaymentMethodItem';
import AddPaymentDialog, { PaymentFormValues } from './AddPaymentDialog';
import UpdatePaymentDialog from './UpdatePaymentDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface PaymentMethod {
  type: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  brand: string;
  isDefault?: boolean;
}

const PaymentMethodsCard = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [showUpdatePaymentDialog, setShowUpdatePaymentDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      type: 'Credit Card',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2026,
      brand: 'Visa',
      isDefault: true
    }
  ]);

  const determineCardBrand = (cardNumber: string) => {
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'Mastercard';
    if (firstDigit === '3') return 'Amex';
    if (firstDigit === '6') return 'Discover';
    return 'Card';
  };

  const handleAddPaymentMethod = (data: PaymentFormValues) => {
    setIsProcessing(true);
    setTimeout(() => {
      const last4 = data.cardNumber.slice(-4);
      const newPaymentMethod: PaymentMethod = {
        type: 'Credit Card',
        last4,
        expiryMonth: parseInt(data.expiryMonth),
        expiryYear: parseInt(data.expiryYear),
        brand: determineCardBrand(data.cardNumber),
        isDefault: data.isDefault,
      };
      
      if (data.isDefault) {
        setPaymentMethods(prev => prev.map(method => ({...method, isDefault: false})));
      }
      
      setPaymentMethods(prev => [...prev, newPaymentMethod]);
      
      toast({
        title: "Payment method added",
        description: `Your ${newPaymentMethod.brand} card ending in ${last4} has been added.`,
      });
      
      setShowAddPaymentDialog(false);
      setIsProcessing(false);
    }, 1500);
  };

  const handleUpdatePaymentMethod = (data: PaymentFormValues) => {
    if (selectedPaymentMethod === null) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      const last4 = data.cardNumber.slice(-4);
      const updatedPaymentMethod: PaymentMethod = {
        type: 'Credit Card',
        last4,
        expiryMonth: parseInt(data.expiryMonth),
        expiryYear: parseInt(data.expiryYear),
        brand: determineCardBrand(data.cardNumber),
        isDefault: data.isDefault,
      };
      
      let updatedMethods = [...paymentMethods];
      
      if (data.isDefault) {
        updatedMethods = updatedMethods.map(method => ({...method, isDefault: false}));
      }
      
      updatedMethods[selectedPaymentMethod] = updatedPaymentMethod;
      
      setPaymentMethods(updatedMethods);
      
      toast({
        title: "Payment method updated",
        description: `Your ${updatedPaymentMethod.brand} card ending in ${last4} has been updated.${data.isDefault ? ' It is now your default payment method.' : ''}`,
      });
      
      setShowUpdatePaymentDialog(false);
      setSelectedPaymentMethod(null);
      setIsProcessing(false);
    }, 1500);
  };

  const openUpdatePaymentDialog = (index: number) => {
    setSelectedPaymentMethod(index);
    const method = paymentMethods[index];
    
    const defaultValues: PaymentFormValues = {
      cardNumber: `•••• •••• •••• ${method.last4}`,
      cardHolder: 'Current Cardholder',
      expiryMonth: method.expiryMonth.toString(),
      expiryYear: method.expiryYear.toString(),
      cvv: '',
      isDefault: method.isDefault || false,
    };
    
    setShowUpdatePaymentDialog(true);
  };

  const openDeleteDialog = (index: number) => {
    setSelectedPaymentMethod(index);
    setShowDeleteDialog(true);
  };

  const handleDeletePaymentMethod = () => {
    if (selectedPaymentMethod === null) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      const deletedMethod = paymentMethods[selectedPaymentMethod];
      
      setPaymentMethods(prev => prev.filter((_, index) => index !== selectedPaymentMethod));
      
      toast({
        title: "Payment method deleted",
        description: `Your ${deletedMethod.brand} card ending in ${deletedMethod.last4} has been removed.`,
      });
      
      setShowDeleteDialog(false);
      setSelectedPaymentMethod(null);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-pink-600" />
          Payment Methods
        </CardTitle>
        <CardDescription>
          Manage your payment methods and billing information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentMethods.map((method, index) => (
            <PaymentMethodItem
              key={index}
              method={method}
              onUpdateClick={() => openUpdatePaymentDialog(index)}
              onDeleteClick={() => openDeleteDialog(index)}
              showDeleteButton={paymentMethods.length > 1}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => setShowAddPaymentDialog(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </CardFooter>

      <AddPaymentDialog
        open={showAddPaymentDialog}
        onOpenChange={setShowAddPaymentDialog}
        onSubmit={handleAddPaymentMethod}
        isProcessing={isProcessing}
      />

      {selectedPaymentMethod !== null && (
        <UpdatePaymentDialog
          open={showUpdatePaymentDialog}
          onOpenChange={setShowUpdatePaymentDialog}
          onSubmit={handleUpdatePaymentMethod}
          isProcessing={isProcessing}
          defaultValues={{
            cardNumber: `•••• •••• •••• ${paymentMethods[selectedPaymentMethod].last4}`,
            cardHolder: 'Current Cardholder',
            expiryMonth: paymentMethods[selectedPaymentMethod].expiryMonth.toString(),
            expiryYear: paymentMethods[selectedPaymentMethod].expiryYear.toString(),
            cvv: '',
            isDefault: paymentMethods[selectedPaymentMethod].isDefault || false,
          }}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedPaymentMethod !== null && paymentMethods[selectedPaymentMethod] ? (
                <>
                  Are you sure you want to delete your {paymentMethods[selectedPaymentMethod].brand} card 
                  ending in {paymentMethods[selectedPaymentMethod].last4}? This action cannot be undone.
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
              onClick={handleDeletePaymentMethod}
              disabled={isProcessing}
            >
              {isProcessing ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default PaymentMethodsCard;
