
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ProfileFormValues } from '../types';
import { Home } from 'lucide-react';

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
            <div className="relative">
              <div className="absolute left-3 top-3">
                <Home className="h-4 w-4 text-gray-500" />
              </div>
              <Textarea placeholder="123 Main St, Apt 4B" {...field} tabIndex={7} className="w-full pl-10" />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StreetAddressField;
