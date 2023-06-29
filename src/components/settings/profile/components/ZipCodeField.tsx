
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProfileFormValues } from '../types';
import { Hash } from 'lucide-react';

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
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Hash className="h-4 w-4 text-gray-500" />
              </div>
              <Input placeholder="94103" {...field} tabIndex={10} className="w-full pl-10" />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ZipCodeField;
