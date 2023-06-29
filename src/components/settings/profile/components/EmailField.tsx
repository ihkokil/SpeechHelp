
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Mail } from 'lucide-react';
import { ProfileFormValues } from '../types';

interface EmailFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

const EmailField = ({ form }: EmailFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-500 mr-2" />
              <Input placeholder="name@example.com" {...field} tabIndex={3} className="w-full" />
            </div>
          </FormControl>
          <FormDescription>
            This email is associated with your account
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EmailField;
