
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard } from 'lucide-react';
import AddPaymentDialog from './AddPaymentDialog';
import UpdatePaymentDialog from './UpdatePaymentDialog';
import DeletePaymentDialog from './DeletePaymentDialog';
import { PaymentMethod, PaymentFormValues } from './types';
import PaymentMethodItem from './PaymentMethodItem';
import { useToast } from '@/hooks/use-toast';
import { determineCardBrand } from './utils/paymentMethodUtils';

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddPaymentMethod = (data: PaymentFormValues) => {
    setIsProcessing(true);
    setTimeout(() => {
      const last4 = data.cardNumber.slice(-4);
      const newPaymentMethod: PaymentMethod = {
        type: data.cardType,
        last4,
        expiryMonth: parseInt(data.expiryMonth),
        expiryYear: parseInt(data.expiryYear),
        brand: data.cardType === 'Select card type' ? determineCardBrand(data.cardNumber) : data.cardType,
        isDefault: data.isDefault,
        cardHolder: data.cardHolder,
        billingAddress: {
          street: data.billingStreet,
          city: data.billingCity,
          state: data.billingState,
          zipCode: data.billingZip,
          country: data.billingCountry
        }
      };
      
      onAddPaymentMethod(newPaymentMethod);
      
      setIsProcessing(false);
      setIsAddDialogOpen(false);  // Close the dialog after successful submission
    }, 1500);
  };

  const handleUpdatePaymentMethod = (data: PaymentFormValues) => {
    if (selectedPaymentMethod === null) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      const last4 = data.cardNumber.slice(-4);
      const updatedPaymentMethod: PaymentMethod = {
        type: data.cardType,
        last4,
        expiryMonth: parseInt(data.expiryMonth),
        expiryYear: parseInt(data.expiryYear),
        brand: data.cardType === 'Select card type' ? determineCardBrand(data.cardNumber) : data.cardType,
        isDefault: data.isDefault,
        cardHolder: data.cardHolder,
        billingAddress: {
          street: data.billingStreet,
          city: data.billingCity,
          state: data.billingState,
          zipCode: data.billingZip,
          country: data.billingCountry
        }
      };
      
      onUpdatePaymentMethod(selectedPaymentMethod, updatedPaymentMethod);
      
      setSelectedPaymentMethod(null);
      setIsProcessing(false);
      setIsUpdateDialogOpen(false);  // Close the dialog after successful submission
    }, 1500);
  };

  const handleDeletePaymentMethod = () => {
    if (selectedPaymentMethod === null) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      onDeletePaymentMethod(selectedPaymentMethod);
      
      setSelectedPaymentMethod(null);
      setIsProcessing(false);
      setIsDeleteDialogOpen(false);  // Close the dialog after successful deletion
    }, 1000);
  };

  const getUpdateFormDefaultValues = (): PaymentFormValues => {
    if (selectedPaymentMethod === null) {
      return {
        cardType: '',
        cardNumber: '',
        cardHolder: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        isDefault: false,
        billingStreet: '',
        billingCity: '',
        billingState: '',
        billingZip: '',
        billingCountry: '',
      };
    }
    
    const method = paymentMethods[selectedPaymentMethod];
    return {
      cardType: method.brand,
      cardNumber: `${method.last4.padStart(16, '0')}`,  // Normally we wouldn't store full card numbers
      cardHolder: method.cardHolder,
      expiryMonth: method.expiryMonth.toString(),
      expiryYear: method.expiryYear.toString(),
      cvv: '',
      isDefault: method.isDefault || false,
      billingStreet: method.billingAddress.street,
      billingCity: method.billingAddress.city,
      billingState: method.billingAddress.state,
      billingZip: method.billingAddress.zipCode,
      billingCountry: method.billingAddress.country,
    };
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
          <div className="text-center py-8 border rounded-lg border-dashed">
            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-semibold">No payment methods</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You haven't added any payment methods yet.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsAddDialogOpen(true)}
            >
              Add a payment method
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method, index) => (
              <PaymentMethodItem 
                key={`${method.brand}-${method.last4}-${index}`}
                paymentMethod={method}
                onEdit={() => {
                  setSelectedPaymentMethod(index);
                  setIsUpdateDialogOpen(true);
                }}
                onDelete={() => {
                  setSelectedPaymentMethod(index);
                  setIsDeleteDialogOpen(true);
                }}
                canDelete={!method.isDefault || paymentMethods.length > 1}
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
      
      <UpdatePaymentDialog 
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        onSubmit={handleUpdatePaymentMethod}
        isProcessing={isProcessing}
        defaultValues={getUpdateFormDefaultValues()}
      />
      
      <DeletePaymentDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeletePaymentMethod}
        isProcessing={isProcessing}
        paymentMethod={selectedPaymentMethod !== null ? paymentMethods[selectedPaymentMethod] : undefined}
      />
    </Card>
  );
};

export default PaymentMethodsCard;
