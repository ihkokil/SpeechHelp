
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProfileFormValues } from '../types';
import { Building } from 'lucide-react';

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
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Building className="h-4 w-4 text-gray-500" />
              </div>
              <Input 
                {...field} 
                placeholder="City"
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

export default CityField;
