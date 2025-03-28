
import countryData from '@/data/countries';
import statesProvinces, { StateProvince } from '@/data/statesProvinces';

export const getCountryByCode = (code: string) => {
  return countryData.find(c => c.code === code);
};

export const getCountryByName = (name: string) => {
  return countryData.find(c => c.name === name);
};

export const getStatesForCountry = (countryCode: string): StateProvince[] => {
  return statesProvinces[countryCode] || [];
};

export const isStateValidForCountry = (stateName: string, states: StateProvince[]): boolean => {
  return states.length === 0 || states.some(s => s.name === stateName);
};
