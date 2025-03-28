
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProfileFormValues } from '../types';
import { Pin } from 'lucide-react';

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
          <FormLabel>Zip / Postal Code</FormLabel>
          <FormControl>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Pin className="h-4 w-4 text-gray-500" />
              </div>
              <Input 
                {...field} 
                placeholder="Zip / Postal Code" 
                className="pl-10"
                tabIndex={8}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ZipCodeField;
