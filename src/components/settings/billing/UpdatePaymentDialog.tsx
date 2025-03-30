
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { PaymentMethod } from './types';
import { paymentMethodSchema, PaymentFormValues } from './payment-form/PaymentFormSchema';
import CardInformationFields from './payment-form/CardInformationFields';
import BillingAddressFields from './payment-form/BillingAddressFields';
import DefaultPaymentCheckbox from './payment-form/DefaultPaymentCheckbox';
import { formatCardNumber, detectCardType, getCvvLength } from './payment-form/cardUtils';

interface UpdatePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PaymentFormValues) => void;
  paymentMethod: PaymentMethod | null;
  isProcessing: boolean;
}

const UpdatePaymentDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  paymentMethod,
  isProcessing
}: UpdatePaymentDialogProps) => {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
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
    },
  });

  // Reset form and populate with payment method data when dialog opens or payment method changes
  useEffect(() => {
    if (open && paymentMethod) {
      form.reset({
        cardType: paymentMethod.brand,
        // For security, we don't auto-fill the card number (only last 4 are stored)
        cardNumber: '',
        cardHolder: paymentMethod.cardHolder,
        expiryMonth: paymentMethod.expiryMonth.toString(),
        expiryYear: paymentMethod.expiryYear.toString(),
        cvv: '',
        isDefault: paymentMethod.isDefault || false,
        billingStreet: paymentMethod.billingAddress.street,
        billingCity: paymentMethod.billingAddress.city,
        billingState: paymentMethod.billingAddress.state,
        billingZip: paymentMethod.billingAddress.zipCode,
        billingCountry: paymentMethod.billingAddress.country,
      });
    }
  }, [open, paymentMethod, form]);

  const handleSubmitForm = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Payment Method</DialogTitle>
          <DialogDescription>
            Edit your card details below to update this payment method.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmitForm} className="space-y-6">
            <CardInformationFields 
              form={form} 
              formatCardNumber={formatCardNumber}
              detectCardType={detectCardType}
              getCvvLength={getCvvLength}
            />
            
            <BillingAddressFields form={form} />
            
            <DefaultPaymentCheckbox form={form} />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Update Payment Method"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePaymentDialog;
