
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentMethodSchema, PaymentFormValues } from './AddPaymentDialog';

interface UpdatePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PaymentFormValues) => void;
  isProcessing: boolean;
  defaultValues: PaymentFormValues;
}

const UpdatePaymentDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isProcessing, 
  defaultValues 
}: UpdatePaymentDialogProps) => {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Payment Method</DialogTitle>
          <DialogDescription>
            Update your card details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cardHolder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cardholder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="1234 5678 9012 3456" 
                      value={field.value}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '');
                        if (/^[\d•]*$/.test(value) && value.length <= 16) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="expiryMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="MM" 
                        maxLength={2}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value) && parseInt(value || '0') <= 12) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expiryYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="YY" 
                        maxLength={4}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123" 
                        maxLength={4}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2 border rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Make this my default payment method</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
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
