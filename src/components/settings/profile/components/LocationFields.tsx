
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '../types';
import { StateProvince } from '@/data/statesProvinces';
import CityField from './CityField';
import StateSelector from './StateSelector';
import ZipCodeField from './ZipCodeField';

interface LocationFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
  availableStates: StateProvince[];
}

const LocationFields = ({ form, availableStates }: LocationFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CityField form={form} />
        <StateSelector form={form} availableStates={availableStates} />
      </div>
      <ZipCodeField form={form} />
    </div>
  );
};

export default LocationFields;
