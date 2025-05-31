import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { paymentMethodSchema, PaymentFormValues } from './payment-form/PaymentFormSchema';
import CardInformationFields from './payment-form/CardInformationFields';
import BillingAddressFields from './payment-form/BillingAddressFields';
import DefaultPaymentCheckbox from './payment-form/DefaultPaymentCheckbox';

interface AddPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PaymentFormValues) => void;
  isProcessing: boolean;
}

const AddPaymentDialog = ({ open, onOpenChange, onSubmit, isProcessing }: AddPaymentDialogProps) => {
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
    if (open) {
      form.reset({
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
      });
    }
  }, [open, form]);

  const handleSubmitForm = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Enter your card details below to add a new payment method.
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
                {isProcessing ? "Processing..." : "Add Payment Method"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentDialog;
