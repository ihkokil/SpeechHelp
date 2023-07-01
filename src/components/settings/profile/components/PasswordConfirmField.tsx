
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProfileFormValues } from '../types';
import { Lock } from 'lucide-react';

interface PasswordConfirmFieldProps {
  form: UseFormReturn<ProfileFormValues>;
  isEmailChanged: boolean;
}

const PasswordConfirmField = ({ form, isEmailChanged }: PasswordConfirmFieldProps) => {
  if (!isEmailChanged) return null;

  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-pink-600">Password Confirmation</FormLabel>
          <FormDescription>
            Please enter your current password to confirm email change
          </FormDescription>
          <FormControl>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Lock className="h-4 w-4 text-gray-500" />
              </div>
              <Input 
                {...field} 
                type="password" 
                placeholder="Enter your current password"
                className="pl-10"
                data-focus-visible="true"
                required={isEmailChanged}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PasswordConfirmField;
