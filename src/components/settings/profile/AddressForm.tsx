
import { UseFormReturn } from 'react-hook-form';
import { MapPin } from 'lucide-react';
import { ProfileFormValues } from './types';
import { StateProvince } from '../../../data/statesProvinces';
import CountrySelector from './components/CountrySelector';
import StreetAddressField from './components/StreetAddressField';
import LocationFields from './components/LocationFields';

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
        <CountrySelector 
          form={form} 
          handleCountryChange={handleCountryChange} 
        />
        
        <StreetAddressField form={form} />
        
        <LocationFields 
          form={form} 
          availableStates={availableStates} 
        />
      </div>
    </div>
  );
};

export default AddressForm;
