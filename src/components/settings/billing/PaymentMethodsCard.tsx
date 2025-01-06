
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddPaymentDialog from './AddPaymentDialog';
import DeletePaymentDialog from './DeletePaymentDialog';
import { PaymentMethod, PaymentFormValues } from './types';
import PaymentMethodItem from './PaymentMethodItem';
import EmptyPaymentMethods from './components/EmptyPaymentMethods';
import { usePaymentMethodActions } from './hooks/usePaymentMethodActions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  const handleSetDefault = async (index: number) => {
    const paymentMethod = paymentMethods[index];
    if (!paymentMethod.id) {
      toast({
        title: "Error",
        description: "Payment method ID not found",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('set-default-payment-method', {
        body: { paymentMethodId: paymentMethod.id }
      });

      if (error) {
        console.error('Error setting default payment method:', error);
        toast({
          title: "Error",
          description: "Failed to set default payment method",
          variant: "destructive"
        });
        return;
      }

      // Update local state to reflect the change
      const updatedMethods = paymentMethods.map((method, i) => ({
        ...method,
        isDefault: i === index
      }));

      // Update all payment methods to reflect the new default
      updatedMethods.forEach((method, i) => {
        onUpdatePaymentMethod(i, method);
      });

      toast({
        title: "Success",
        description: `${paymentMethod.brand} card ending in ${paymentMethod.last4} is now your default payment method.`,
      });
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast({
        title: "Error",
        description: "Failed to set default payment method",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Manage your payment methods and billing information.
          </CardDescription>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add Payment Method
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.length === 0 ? (
          <EmptyPaymentMethods onAddClick={() => setIsAddDialogOpen(true)} />
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method, index) => (
              <PaymentMethodItem 
                key={`${method.brand}-${method.last4}-${index}`}
                paymentMethod={method}
                onSetDefault={() => handleSetDefault(index)}
                onDelete={() => {
                  setSelectedPaymentMethod(index);
                  setIsDeleteDialogOpen(true);
                }}
                canDelete={!method.isDefault || paymentMethods.length > 1}
                canSetDefault={!method.isDefault}
              />
            ))}
          </div>
        )}
      </CardContent>
      
      <AddPaymentDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddPaymentMethod}
        isProcessing={isProcessing}
      />
      
      <DeletePaymentDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeletePaymentMethod}
        isProcessing={isProcessing}
        paymentMethod={getSelectedPaymentMethod()}
      />
    </Card>
  );
};

export default PaymentMethodsCard;
