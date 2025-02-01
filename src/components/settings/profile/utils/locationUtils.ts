
import countries from '@/data/countries';
import statesProvinces from '@/data/statesProvinces';

export interface CountryEntry {
  code: string;
  name: string;
  dialCode: string;
}

export interface StateEntry {
  code: string;
  name: string;
  countryCode: string;
}

export const getCountryByCode = (code: string): CountryEntry | undefined => {
  return countries.find(country => country.code === code);
};

export const getStatesForCountry = (countryCode: string): StateEntry[] => {
  return statesProvinces.filter(state => state.countryCode === countryCode);
};

export const getAllCountries = (): CountryEntry[] => {
  return countries;
};

export const getAllStates = (): StateEntry[] => {
  return statesProvinces;
};
