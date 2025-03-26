
import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import countryData from '../../../data/countries';
import { StateProvince } from '../../../data/statesProvinces';
import { ProfileFormValues } from './types';

interface AddressFormProps {
  form: UseFormReturn<ProfileFormValues>;
  availableStates: StateProvince[];
  handleCountryChange: (countryName: string) => void;
}

const AddressForm = ({ form, availableStates, handleCountryChange }: AddressFormProps) => {
  return (
    <div className="border-t pt-6 mt-6">
      <h3 className="font-medium text-gray-900 mb-4 flex items-center">
        <MapPin className="h-4 w-4 text-pink-600 mr-2" />
        Address Information
      </h3>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country of Residence</FormLabel>
              <Select 
                onValueChange={handleCountryChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger tabIndex={6}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {countryData.map((country) => (
                    <SelectItem key={country.code} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      
        <FormField
          control={form.control}
          name="streetAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Textarea placeholder="123 Main St, Apt 4B" {...field} tabIndex={7} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State / Province</FormLabel>
                <Select 
                  onValueChange={field.onChange}
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
        </div>
        
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ZIP / Postal Code</FormLabel>
              <FormControl>
                <Input placeholder="94103" {...field} tabIndex={10} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AddressForm;
