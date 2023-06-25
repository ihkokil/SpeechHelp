
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
            <div className="flex items-center">
              <Hash className="h-4 w-4 text-gray-500 mr-2" />
              <Input placeholder="94103" {...field} tabIndex={10} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ZipCodeField;
