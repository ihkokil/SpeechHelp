
import { UseFormReturn } from 'react-hook-form';
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
  );
};

export default AddressForm;
