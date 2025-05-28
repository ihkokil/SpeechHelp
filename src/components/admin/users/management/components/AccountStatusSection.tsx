
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { EditUserFormData } from './types';

interface AccountStatusSectionProps {
  form: UseFormReturn<EditUserFormData>;
}

export const AccountStatusSection: React.FC<AccountStatusSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Account Status</h3>
      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Active Account</FormLabel>
              <div className="text-sm text-muted-foreground">
                Enable or disable this user's account access
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
