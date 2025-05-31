
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { paymentMethodSchema, PaymentFormValues } from './payment-form/PaymentFormSchema';
import CardInformationFields from './payment-form/CardInformationFields';
import DefaultPaymentCheckbox from './payment-form/DefaultPaymentCheckbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PaymentFormValues) => void;
  isProcessing: boolean;
}

const AddPaymentDialog = ({ open, onOpenChange, onSubmit, isProcessing }: AddPaymentDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const handleSubmitForm = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    
    try {
      console.log('Submitting payment method data:', {
        cardNumber: '****' + data.cardNumber.slice(-4),
        cardHolder: data.cardHolder,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        isDefault: data.isDefault
      });

      // For now, we'll simulate a successful payment method addition
      // since the Setup Intent flow requires a more complex Stripe Elements integration
      
      // In a production environment, you would:
      // 1. Load Stripe.js
      // 2. Create elements 
      // 3. Confirm the setup intent with the card details
      // 4. Save the resulting payment method
      
      // For development/testing, we'll create a mock payment method
      const mockPaymentMethod = {
        id: `pm_test_${Date.now()}`,
        type: 'Credit Card' as const,
        last4: data.cardNumber.slice(-4),
        expiryMonth: parseInt(data.expiryMonth),
        expiryYear: parseInt(data.expiryYear),
        brand: data.cardNumber.startsWith('4') ? 'Visa' : 
               data.cardNumber.startsWith('5') ? 'Mastercard' : 
               data.cardNumber.startsWith('3') ? 'Amex' : 'Unknown',
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

      // Create a PaymentFormValues object to pass to the parent component
      const paymentFormData: PaymentFormValues = {
        ...data,
        cardType: mockPaymentMethod.brand,
      };

      toast({
        title: "Payment method added",
        description: `Your ${mockPaymentMethod.brand} card ending in ${mockPaymentMethod.last4} has been saved for future use. Note: This is a test implementation.`,
      });

      onSubmit(paymentFormData);
      onOpenChange(false);

    } catch (error) {
      console.error('Error adding payment method:', error);
      toast({
        title: "Error",
        description: "Failed to add payment method. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Enter your card details below to add a new payment method for automatic subscription renewal.
            <br />
            <em className="text-sm text-muted-foreground mt-2 block">
              Note: This is a simplified test implementation. In production, this would use Stripe Elements for secure card collection.
            </em>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmitForm} className="space-y-6">
            <CardInformationFields form={form} />
            
            <DefaultPaymentCheckbox form={form} />
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                disabled={isSubmitting || isProcessing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isProcessing}>
                {isSubmitting ? "Adding Card..." : "Add Payment Method"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentDialog;
