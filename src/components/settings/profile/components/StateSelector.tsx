
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StateProvince } from '@/data/statesProvinces';
import { ProfileFormValues } from '../types';

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
          <Select 
            onValueChange={(value) => {
              console.log('State selected:', value);
              field.onChange(value);
            }}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger tabIndex={9}>
                <SelectValue placeholder="Select state/province" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white max-h-60">
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StateSelector;
