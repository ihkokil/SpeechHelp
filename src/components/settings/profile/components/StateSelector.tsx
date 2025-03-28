
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StateProvince } from '@/data/statesProvinces';
import { ProfileFormValues } from '../types';
import { MapPin } from 'lucide-react';

interface StateSelectorProps {
  form: UseFormReturn<ProfileFormValues>;
  availableStates: StateProvince[];
}

const StateSelector = ({ form, availableStates }: StateSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="state"
      render={({ field }) => (
        <FormItem>
          <FormLabel>State / Province</FormLabel>
          <FormControl>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <MapPin className="h-4 w-4 text-gray-500" />
              </div>
              <Select 
                onValueChange={field.onChange}
                value={field.value || ''}
                defaultValue={field.value || ''}
              >
                <SelectTrigger className="w-full pl-10" tabIndex={9}>
                  <SelectValue placeholder="Select State / Province" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-60 z-[150]">
                  {availableStates.length > 0 ? (
                    availableStates.map((state) => (
                      <SelectItem key={state.code} value={state.name}>
                        {state.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="N/A">No states/provinces available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StateSelector;
