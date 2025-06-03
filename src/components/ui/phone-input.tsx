
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { getAllCountries, getCountryByDialCode, formatPhoneNumber, stripNonNumeric } from '@/utils/phoneUtils';

interface PhoneInputProps {
  form: UseFormReturn<any>;
  phoneFieldName: string;
  countryFieldName: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  form,
  phoneFieldName,
  countryFieldName,
  label = "Phone Number",
  placeholder = "Enter phone number",
  required = false
}) => {
  const [formattedPhone, setFormattedPhone] = useState('');
  const countries = getAllCountries();
  
  const watchedPhone = form.watch(phoneFieldName);
  const watchedCountryCode = form.watch(countryFieldName);
  
  useEffect(() => {
    if (watchedPhone) {
      setFormattedPhone(formatPhoneNumber(watchedPhone));
    } else {
      setFormattedPhone('');
    }
  }, [watchedPhone]);
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = stripNonNumeric(value);
    
    form.setValue(phoneFieldName, numericValue);
    setFormattedPhone(formatPhoneNumber(numericValue));
  };
  
  const handleCountryChange = (dialCode: string) => {
    form.setValue(countryFieldName, dialCode);
  };
  
  const selectedCountry = getCountryByDialCode(watchedCountryCode);
  const dialCode = selectedCountry?.dialCode || '1';

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name={countryFieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country {required && <span className="text-red-500">*</span>}</FormLabel>
            <Select
              onValueChange={(value) => {
                handleCountryChange(value);
                field.onChange(value);
              }}
              value={field.value}
              defaultValue={field.value}
            >
              <FormControl>
                <div className="relative">
                  <SelectTrigger className="w-full pl-10">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                      <Phone className="h-4 w-4 text-gray-500" />
                    </div>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                </div>
              </FormControl>
              <SelectContent className="bg-white max-h-60 overflow-y-auto">
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.dialCode}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{country.flag}</span>
                      <span>+{country.dialCode}</span>
                      <span>{country.name}</span>
                    </div>
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
        name={phoneFieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label} {required && <span className="text-red-500">*</span>}</FormLabel>
            <FormControl>
              <div className="relative flex items-center">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Phone className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex items-center w-full">
                  <div className="pl-10 pr-2 py-2 border rounded-l-md bg-gray-50 text-gray-500 font-medium min-w-[70px] text-center border-r-0">
                    +{dialCode}
                  </div>
                  <Input 
                    placeholder={placeholder}
                    value={formattedPhone}
                    onChange={handlePhoneChange}
                    className="flex-grow rounded-l-none border-l-0"
                    {...field}
                  />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PhoneInput;
