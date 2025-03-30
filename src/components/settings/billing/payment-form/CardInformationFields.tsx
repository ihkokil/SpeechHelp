import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { PaymentFormValues } from './PaymentFormSchema';
import { formatCardNumber, detectCardType, getCvvLength } from '../utils/paymentMethodUtils';

interface CardInformationFieldsProps {
  form: UseFormReturn<PaymentFormValues>;
}

const CardInformationFields: React.FC<CardInformationFieldsProps> = ({ form }) => {
  const cardNumber = form.watch('cardNumber') || '';
  const detectedCardType = detectCardType(cardNumber);
  const cvvLength = getCvvLength(detectedCardType);

  return (
    <>
      <h3 className="text-lg font-medium">Card Information</h3>
      
      <FormField
        control={form.control}
        name="cardType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Card Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, '');
                  if (/^\d*$/.test(value) && value.length <= 19) {
                    e.target.value = formatCardNumber(value);
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
                  placeholder={detectedCardType === 'amex' ? "4 digits" : "3 digits"} 
                  maxLength={cvvLength}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= cvvLength) {
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
    </>
  );
};

export default CardInformationFields;
