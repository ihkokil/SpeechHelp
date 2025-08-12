
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '../types';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface PasswordConfirmFieldProps {
  form: UseFormReturn<ProfileFormValues>;
  isEmailChanged: boolean;
}

const PasswordConfirmField = ({ form, isEmailChanged }: PasswordConfirmFieldProps) => {
  if (!isEmailChanged) return null;

  return (
    <FormField
      control={form.control}
      name="currentPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Current Password</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="password"
              placeholder="Enter your current password to confirm email change"
              value={field.value || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PasswordConfirmField;
