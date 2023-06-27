
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProfileFormValues } from '../types';
import { Building2 } from 'lucide-react';

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
            <div className="flex items-center">
              <Building2 className="h-4 w-4 text-gray-500 mr-2" />
              <Input placeholder="San Francisco" {...field} tabIndex={8} className="w-full" />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CityField;
