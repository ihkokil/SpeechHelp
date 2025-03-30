
import React from 'react';
import { FormField, FormItem, FormControl, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { PaymentFormValues } from './PaymentFormSchema';

interface DefaultPaymentCheckboxProps {
  form: UseFormReturn<PaymentFormValues>;
}

const DefaultPaymentCheckbox: React.FC<DefaultPaymentCheckboxProps> = ({ form }) => {
  return (
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
  );
};

export default DefaultPaymentCheckbox;
