
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProfileFormValues } from '../types';
import { MapPin } from 'lucide-react';

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
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <MapPin className="h-4 w-4 text-gray-500" />
              </div>
              <Input 
                {...field} 
                placeholder="Street Address"
                className="pl-10"
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StreetAddressField;
