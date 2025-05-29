
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
  const statesForCountry = statesProvinces[countryCode] || [];
  return statesForCountry.map(state => ({
    code: state.code,
    name: state.name,
    countryCode: countryCode
  }));
};

export const getAllCountries = (): CountryEntry[] => {
  return countries;
};

export const getAllStates = (): StateEntry[] => {
  const allStates: StateEntry[] = [];
  Object.entries(statesProvinces).forEach(([countryCode, states]) => {
    states.forEach(state => {
      allStates.push({
        code: state.code,
        name: state.name,
        countryCode: countryCode
      });
    });
  });
  return allStates;
};
