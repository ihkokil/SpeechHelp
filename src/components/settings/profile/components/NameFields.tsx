
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProfileFormValues } from '../types';
import { User } from 'lucide-react';

interface NameFieldsProps {
  form: UseFormReturn<any>;
  isNameSingle?: boolean;
  label?: string;
}

const NameFields = ({ form, isNameSingle = false, label }: NameFieldsProps) => {
  if (isNameSingle) {
    return (
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label || "Display Name"}</FormLabel>
            <FormControl>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <Input 
                  {...field} 
                  placeholder="Display Name" 
                  className="pl-10"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <Input 
                  {...field} 
                  placeholder="First Name" 
                  className="pl-10"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <Input 
                  {...field} 
                  placeholder="Last Name" 
                  className="pl-10"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default NameFields;
