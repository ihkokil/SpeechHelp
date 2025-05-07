
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '../types';
import { ButtonCustom } from '@/components/ui/button-custom';

interface PasswordConfirmFieldProps {
  form: UseFormReturn<ProfileFormValues>;
  isEmailChanged: boolean;
}

const PasswordConfirmField: React.FC<PasswordConfirmFieldProps> = ({ form, isEmailChanged }) => {
  if (!isEmailChanged) return null;
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm your password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="Enter your current password to confirm changes"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PasswordConfirmField;
