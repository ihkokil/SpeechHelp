
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './hooks/useAddUserForm';

interface FieldProps {
  form: UseFormReturn<FormValues>;
}

export const FirstNameField: React.FC<FieldProps> = ({ form }) => (
  <FormField
    control={form.control}
    name="firstName"
    render={({ field }) => (
      <FormItem>
        <FormLabel htmlFor="user-first-name">First Name</FormLabel>
        <FormControl>
          <Input id="user-first-name" placeholder="John" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const LastNameField: React.FC<FieldProps> = ({ form }) => (
  <FormField
    control={form.control}
    name="lastName"
    render={({ field }) => (
      <FormItem>
        <FormLabel htmlFor="user-last-name">Last Name</FormLabel>
        <FormControl>
          <Input id="user-last-name" placeholder="Doe" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const EmailField: React.FC<FieldProps> = ({ form }) => (
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel htmlFor="user-email">Email</FormLabel>
        <FormControl>
          <Input id="user-email" type="email" placeholder="john.doe@example.com" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const PasswordField: React.FC<FieldProps> = ({ form }) => (
  <FormField
    control={form.control}
    name="password"
    render={({ field }) => (
      <FormItem>
        <FormLabel htmlFor="user-password">Password</FormLabel>
        <FormControl>
          <Input id="user-password" type="password" placeholder="••••••••" {...field} />
        </FormControl>
        <FormDescription>
          Password must be at least 8 characters and include uppercase, lowercase, and numbers.
        </FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const RoleField: React.FC<FieldProps> = ({ form }) => (
  <FormField
    control={form.control}
    name="role"
    render={({ field }) => (
      <FormItem>
        <FormLabel htmlFor="user-role">Role</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value} name="role">
          <FormControl>
            <SelectTrigger id="user-role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="premium">Premium User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const ActiveStatusField: React.FC<FieldProps> = ({ form }) => (
  <FormField
    control={form.control}
    name="isActive"
    render={({ field }) => (
      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
        <div className="space-y-0.5">
          <FormLabel htmlFor="user-active-status">Active Status</FormLabel>
          <FormDescription>
            User will be able to sign in immediately if active.
          </FormDescription>
        </div>
        <FormControl>
          <Switch
            id="user-active-status"
            checked={field.value}
            onCheckedChange={field.onChange}
            name="isActive"
          />
        </FormControl>
      </FormItem>
    )}
  />
);
