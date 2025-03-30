
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, PlusCircle } from 'lucide-react';
import PaymentMethodItem from './PaymentMethodItem';
import AddPaymentDialog from './AddPaymentDialog';
import UpdatePaymentDialog from './UpdatePaymentDialog';
import DeletePaymentDialog from './DeletePaymentDialog';
import { usePaymentMethods } from './hooks/usePaymentMethods';
import { determineCardBrand } from './utils/paymentMethodUtils';

const PaymentMethodsCard = () => {
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [showUpdatePaymentDialog, setShowUpdatePaymentDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const {
    paymentMethods,
    isProcessing,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    handleAddPaymentMethod,
    handleUpdatePaymentMethod,
    handleDeletePaymentMethod
  } = usePaymentMethods();

  const openUpdatePaymentDialog = (index: number) => {
    setSelectedPaymentMethod(index);
    setShowUpdatePaymentDialog(true);
  };

  const openDeleteDialog = (index: number) => {
    setSelectedPaymentMethod(index);
    setShowDeleteDialog(true);
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
        <>
          <UpdatePaymentDialog
            open={showUpdatePaymentDialog}
            onOpenChange={setShowUpdatePaymentDialog}
            onSubmit={handleUpdatePaymentMethod}
            isProcessing={isProcessing}
            defaultValues={{
              cardNumber: `•••• •••• •••• ${paymentMethods[selectedPaymentMethod].last4}`,
              cardHolder: paymentMethods[selectedPaymentMethod].cardHolder,
              expiryMonth: paymentMethods[selectedPaymentMethod].expiryMonth.toString(),
              expiryYear: paymentMethods[selectedPaymentMethod].expiryYear.toString(),
              cvv: '',
              isDefault: paymentMethods[selectedPaymentMethod].isDefault || false,
              cardType: paymentMethods[selectedPaymentMethod].brand,
              billingStreet: paymentMethods[selectedPaymentMethod].billingAddress.street,
              billingCity: paymentMethods[selectedPaymentMethod].billingAddress.city,
              billingState: paymentMethods[selectedPaymentMethod].billingAddress.state,
              billingZip: paymentMethods[selectedPaymentMethod].billingAddress.zipCode,
              billingCountry: paymentMethods[selectedPaymentMethod].billingAddress.country
            }}
          />

          <DeletePaymentDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            onDelete={handleDeletePaymentMethod}
            isProcessing={isProcessing}
            paymentMethod={paymentMethods[selectedPaymentMethod]}
          />
        </>
      )}
    </Card>
  );
};

export default PaymentMethodsCard;
