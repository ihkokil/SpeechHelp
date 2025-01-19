
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PaymentMethodItem from './PaymentMethodItem';
import AddPaymentDialog from './AddPaymentDialog';
import DeletePaymentDialog from './DeletePaymentDialog';
import UpdatePaymentDialog from './UpdatePaymentDialog';
import { usePaymentMethodActions } from './hooks/usePaymentMethodActions';
import { PaymentMethod, PaymentFormValues } from './types';
import EmptyPaymentMethods from './components/EmptyPaymentMethods';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PaymentMethodsCardProps {
  paymentMethods: PaymentMethod[];
  onAddPaymentMethod: (method: PaymentMethod) => void;
  onUpdatePaymentMethod: (index: number, method: PaymentMethod) => void;
  onDeletePaymentMethod: (index: number) => void;
}

const PaymentMethodsCard = ({
  paymentMethods,
  onAddPaymentMethod,
  onUpdatePaymentMethod,
  onDeletePaymentMethod
}: PaymentMethodsCardProps) => {
  const { toast } = useToast();
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    isProcessing,
    handleAddPaymentMethod,
    handleDeletePaymentMethod,
    getSelectedPaymentMethod
  } = usePaymentMethodActions({
    paymentMethods,
    onAddPaymentMethod,
    onUpdatePaymentMethod,
    onDeletePaymentMethod
  });

  const handleRealAddPaymentMethod = async (data: PaymentFormValues) => {
    try {
      // Check for duplicate cards before proceeding
      const last4 = data.cardNumber.slice(-4);
      const isDuplicate = paymentMethods.some(method => 
        method.last4 === last4 && 
        method.expiryMonth === parseInt(data.expiryMonth) && 
        method.expiryYear === parseInt(data.expiryYear)
      );

      if (isDuplicate) {
        toast({
          title: "Duplicate Card",
          description: "This card is already saved to your account.",
          variant: "destructive"
        });
        return;
      }

      // Call the add-payment-method edge function
      const { data: result, error } = await supabase.functions.invoke('add-payment-method', {
        body: {
          cardNumber: data.cardNumber,
          expiryMonth: data.expiryMonth,
          expiryYear: data.expiryYear,
          cvv: data.cvv,
          cardHolder: data.cardHolder,
          isDefault: data.isDefault || paymentMethods.length === 0 // Set as default if first card
        }
      });

      if (error) {
        console.error('Error adding payment method:', error);
        toast({
          title: "Error",
          description: "Failed to add payment method. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if (result?.duplicate) {
        toast({
          title: "Duplicate Card",
          description: result.error || "This card is already saved to your account.",
          variant: "destructive"
        });
        return;
      }

      if (result?.success) {
        // Create the local representation for immediate UI update
        const newPaymentMethod: PaymentMethod = {
          id: `temp-${Date.now()}`,
          type: 'Credit Card',
          last4: last4,
          expiryMonth: parseInt(data.expiryMonth),
          expiryYear: parseInt(data.expiryYear),
          brand: data.cardType || 'Unknown',
          isDefault: result.isFirstCard || data.isDefault,
          cardHolder: data.cardHolder,
          billingAddress: {
            street: data.billingStreet,
            city: data.billingCity,
            state: data.billingState,
            zipCode: data.billingZip,
            country: data.billingCountry
          }
        };

        // If this is the first card, make sure no other cards are marked as default
        if (result.isFirstCard && paymentMethods.length === 0) {
          newPaymentMethod.isDefault = true;
        }
        
        onAddPaymentMethod(newPaymentMethod);

        toast({
          title: "Payment Method Added",
          description: `Your card ending in ${last4} has been added${result.isFirstCard ? ' and set as default' : ''}.`,
        });

        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error('Error in handleRealAddPaymentMethod:', error);
      toast({
        title: "Error",
        description: "Failed to add payment method. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSetDefault = async (index: number) => {
    const paymentMethod = paymentMethods[index];
    if (!paymentMethod.id || paymentMethod.id.startsWith('temp-')) {
      toast({
        title: "Error",
        description: "Cannot set this payment method as default yet. Please wait for it to be processed.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('set-default-payment-method', {
        body: { paymentMethodId: paymentMethod.id }
      });

      if (error) {
        console.error('Error setting default payment method:', error);
        toast({
          title: "Error",
          description: "Failed to set default payment method. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Update the local state to reflect the change
      const updatedMethods = paymentMethods.map((method, i) => ({
        ...method,
        isDefault: i === index
      }));
      
      // Update each payment method in the array
      updatedMethods.forEach((method, i) => {
        onUpdatePaymentMethod(i, method);
      });

      toast({
        title: "Default Payment Method Updated",
        description: `Your card ending in ${paymentMethod.last4} is now your default payment method.`,
      });
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast({
        title: "Error",
        description: "Failed to set default payment method. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods for automatic subscription renewal
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <EmptyPaymentMethods onAddClick={() => setIsAddDialogOpen(true)} />
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <PaymentMethodItem
                  key={`${method.id || index}-${method.last4}`}
                  paymentMethod={method}
                  onSetDefault={() => handleSetDefault(index)}
                  onDelete={() => {
                    setSelectedPaymentMethod(index);
                    setIsDeleteDialogOpen(true);
                  }}
                  canDelete={paymentMethods.length > 1 || !method.isDefault}
                  canSetDefault={!method.isDefault}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddPaymentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleRealAddPaymentMethod}
        isProcessing={isProcessing}
      />

      <DeletePaymentDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        paymentMethod={getSelectedPaymentMethod()}
        onDelete={handleDeletePaymentMethod}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default PaymentMethodsCard;
