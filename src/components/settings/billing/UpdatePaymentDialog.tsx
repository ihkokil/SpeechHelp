
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { paymentMethodSchema, PaymentFormValues } from './AddPaymentDialog';
import countryData from '@/data/countries';
import { StateProvince } from '@/data/statesProvinces';
import { getStatesForCountry } from './utils/locationUtils';
import { getCountryByName } from '@/components/settings/profile/utils/locationUtils';

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
  const [states, setStates] = useState<StateProvince[]>([]);
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues,
  });

  const selectedCountry = form.watch('billingCountry');
  
  useEffect(() => {
    if (selectedCountry) {
      const countryObj = getCountryByName(selectedCountry);
      if (countryObj) {
        const statesForCountry = getStatesForCountry(countryObj.code);
        setStates(statesForCountry);
      }
    }
  }, [selectedCountry]);

  // Reset form with new defaultValues when they change
  useEffect(() => {
    if (open && defaultValues) {
      form.reset(defaultValues);
      
      // Initialize states based on country
      const countryObj = getCountryByName(defaultValues.billingCountry);
      if (countryObj) {
        const statesForCountry = getStatesForCountry(countryObj.code);
        setStates(statesForCountry);
      }
    }
  }, [open, defaultValues, form]);

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const handleSubmitForm = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Payment Method</DialogTitle>
          <DialogDescription>
            Edit your payment details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmitForm} className="space-y-6">
            <h3 className="text-lg font-medium">Card Information</h3>
            
            <FormField
              control={form.control}
              name="cardType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select card type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Visa">Visa</SelectItem>
                      <SelectItem value="Mastercard">Mastercard</SelectItem>
                      <SelectItem value="Amex">American Express</SelectItem>
                      <SelectItem value="Discover">Discover</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                      value={field.value ? formatCardNumber(field.value) : ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '');
                        if (/^\d*$/.test(value) && value.length <= 19) {
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
                        placeholder="3 digits" 
                        maxLength={4}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value) && value.length <= 4) {
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
            
            <h3 className="text-lg font-medium border-t pt-6">Billing Address</h3>
            
            <FormField
              control={form.control}
              name="billingStreet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="billingCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="San Francisco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="billingCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full focus:border-pink-500">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white max-h-60">
                        {countryData.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="billingState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={states.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full focus:border-pink-500">
                          <SelectValue placeholder={states.length === 0 ? "Select country first" : "Select state/province"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white max-h-60 z-[150]">
                        {states.length > 0 ? (
                          states.map((state) => (
                            <SelectItem key={state.code} value={state.name}>
                              {state.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="N/A">No states/provinces available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="billingZip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP/Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="94105" {...field} />
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
                {isProcessing ? "Updating..." : "Update Payment Method"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePaymentDialog;
