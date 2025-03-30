
import statesProvinces, { StateProvince } from '@/data/statesProvinces';

export const getStatesForCountry = (countryCode: string): StateProvince[] => {
  return statesProvinces[countryCode] || [];
};
