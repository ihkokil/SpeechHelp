
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ProfileFormValues } from '../types';

interface StreetAddressFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

const StreetAddressField = ({ form }: StreetAddressFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="streetAddress"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Street Address</FormLabel>
          <FormControl>
            <Textarea placeholder="123 Main St, Apt 4B" {...field} tabIndex={7} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StreetAddressField;
