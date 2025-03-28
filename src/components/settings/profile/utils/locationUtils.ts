
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
  // If there are no states for this country, any state value is valid
  if (states.length === 0) return true;
  
  // Check if the state name exists in the available states
  return states.some(s => s.name === stateName);
};

export const getStateCodeByName = (stateName: string, states: StateProvince[]): string => {
  const state = states.find(s => s.name === stateName);
  return state ? state.code : '';
};
