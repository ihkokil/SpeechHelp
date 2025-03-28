
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProfileFormValues } from '../types';

interface ZipCodeFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

const ZipCodeField = ({ form }: ZipCodeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="zipCode"
      render={({ field }) => (
        <FormItem>
          <FormLabel>ZIP / Postal Code</FormLabel>
          <FormControl>
            <Input placeholder="94103" {...field} tabIndex={10} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ZipCodeField;
