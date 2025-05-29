
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

  const handleRealAddPaymentMethod = (data: PaymentFormValues) => {
    const last4 = data.cardNumber.slice(-4);
    const expiryMonth = parseInt(data.expiryMonth);
    const expiryYear = parseInt(data.expiryYear);
    
    // Check if a card with the same last 4 digits and expiry date already exists
    const existingCard = paymentMethods.find(method => 
      method.last4 === last4 && 
      method.expiryMonth === expiryMonth && 
      method.expiryYear === expiryYear
    );
    
    if (existingCard) {
      toast({
        title: "Card already exists",
        description: `A card ending in ${last4} with the same expiry date is already saved.`,
        variant: "destructive"
      });
      return;
    }
    
    // The payment method has already been added to Stripe via the edge function
    // Now we need to create the local representation for the UI
    const newPaymentMethod: PaymentMethod = {
      id: `temp-${Date.now()}`, // This will be replaced when we refresh from Stripe
      type: 'Credit Card',
      last4: last4,
      expiryMonth: expiryMonth,
      expiryYear: expiryYear,
      brand: data.cardType || 'Unknown',
      isDefault: paymentMethods.length === 0 || data.isDefault, // First card is default, or if explicitly set
      cardHolder: data.cardHolder,
      billingAddress: {
        street: data.billingStreet,
        city: data.billingCity,
        state: data.billingState,
        zipCode: data.billingZip,
        country: data.billingCountry
      }
    };
    
    // If this is being set as default and there are existing cards, update them
    if (newPaymentMethod.isDefault && paymentMethods.length > 0) {
      // This will be handled by the parent component when it updates existing cards
    }
    
    onAddPaymentMethod(newPaymentMethod);
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
                  onSetDefault={() => {
                    const updatedMethod = { ...method, isDefault: true };
                    onUpdatePaymentMethod(index, updatedMethod);
                  }}
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
