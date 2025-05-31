
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

  useEffect(() => {
    if (open && paymentMethod) {
      console.log('Setting form values from payment method:', paymentMethod);
      
      // Format the payment method data to match the form structure
      const formValues = {
        cardType: paymentMethod.brand || '',
        cardNumber: '', // Don't populate the full card number for security
        cardHolder: paymentMethod.cardHolder || '',
        expiryMonth: paymentMethod.expiryMonth ? paymentMethod.expiryMonth.toString().padStart(2, '0') : '',
        expiryYear: paymentMethod.expiryYear ? paymentMethod.expiryYear.toString() : '',
        cvv: '', // Don't populate CVV for security
        isDefault: paymentMethod.isDefault || false,
        billingStreet: paymentMethod.billingAddress?.street || '',
        billingCity: paymentMethod.billingAddress?.city || '',
        billingState: paymentMethod.billingAddress?.state || '',
        billingZip: paymentMethod.billingAddress?.zipCode || '',
        billingCountry: paymentMethod.billingAddress?.country || '',
      };

      console.log('Form values to set:', formValues);
      form.reset(formValues);
    }
  }, [open, paymentMethod, form]);

  const handleSubmitForm = form.handleSubmit((data) => {
    console.log('Submitting payment method update:', data);
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
            <CardInformationFields form={form} />
            
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
