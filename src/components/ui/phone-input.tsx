
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Phone, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { getAllCountries, getCountryByCode, formatPhoneNumber, stripNonNumeric } from '@/utils/phoneUtils';

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
  const [countryOpen, setCountryOpen] = useState(false);
  const countries = getAllCountries();
  
  const watchedPhone = form.watch(phoneFieldName);
  const watchedCountry = form.watch(countryFieldName);
  
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
  
  const handleCountryChange = (countryCode: string) => {
    console.log('Phone country changing to:', countryCode);
    form.setValue(countryFieldName, countryCode);
    form.trigger(countryFieldName);
    setCountryOpen(false);
  };
  
  const selectedCountry = getCountryByCode(watchedCountry);
  const dialCode = selectedCountry?.dialCode || '1';

  console.log('PhoneInput - watchedCountry:', watchedCountry);
  console.log('PhoneInput - selectedCountry:', selectedCountry);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name={countryFieldName}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Country {required && <span className="text-red-500">*</span>}</FormLabel>
            <Popover open={countryOpen} onOpenChange={setCountryOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={countryOpen}
                    className="w-full justify-between pl-10 text-black hover:text-black"
                  >
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Phone className="h-4 w-4 text-gray-500" />
                    </div>
                    {selectedCountry ? (
                      <span className="flex items-center gap-2 text-black">
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span>+{selectedCountry.dialCode}</span>
                        <span>{selectedCountry.name}</span>
                      </span>
                    ) : (
                      <span className="text-gray-500">Select Country...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search countries..." 
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((country) => (
                        <CommandItem
                          key={country.code}
                          value={`${country.name} ${country.code} +${country.dialCode}`}
                          onSelect={() => handleCountryChange(country.code)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              watchedCountry === country.code ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{country.flag}</span>
                            <span>+{country.dialCode}</span>
                            <span>{country.name}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
                    autoComplete="off"
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
