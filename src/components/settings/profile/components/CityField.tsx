
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProfileFormValues } from '../types';

interface CityFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

const CityField = ({ form }: CityFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="city"
      render={({ field }) => (
        <FormItem>
          <FormLabel>City</FormLabel>
          <FormControl>
            <Input placeholder="San Francisco" {...field} tabIndex={8} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CityField;
