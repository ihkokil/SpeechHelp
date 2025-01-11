
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
      // Call the Stripe edge function to add the payment method
      const { data: result, error } = await supabase.functions.invoke('add-payment-method', {
        body: {
          cardNumber: data.cardNumber,
          expiryMonth: data.expiryMonth,
          expiryYear: data.expiryYear,
          cvv: data.cvv,
          cardHolder: data.cardHolder,
          isDefault: data.isDefault,
          billingAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'US',
          },
        },
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

      if (result?.success) {
        toast({
          title: "Success",
          description: result.message || "Payment method added successfully!",
        });

        // Create a PaymentFormValues object to pass to the parent component
        const paymentFormData: PaymentFormValues = {
          ...data,
          cardType: result.paymentMethod.brand || data.cardType,
        };

        onSubmit(paymentFormData);
        onOpenChange(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to add payment method. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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
