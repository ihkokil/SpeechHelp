
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../../types';
import { formatUserDisplayName } from '../utils/userDisplayUtils';
import countries from '@/data/countries';
import statesProvinces from '@/data/statesProvinces';

const editUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  countryCode: z.string().default('US'),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().default('United States'),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserFormProps {
  user: User;
  onUserUpdated: (updatedUser: User) => void;
  onCancel: () => void;
}

export const EditUserForm: React.FC<EditUserFormProps> = ({
  user,
  onUserUpdated,
  onCancel
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [availableStates, setAvailableStates] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
  });

  const watchedCountryCode = watch('countryCode');

  // Load user data into form
  useEffect(() => {
    if (user) {
      const metadata = user.user_metadata || {};
      reset({
        firstName: metadata.first_name || user.first_name || '',
        lastName: metadata.last_name || user.last_name || '',
        email: user.email || '',
        phone: metadata.phone || user.phone || '',
        countryCode: metadata.country_code || 'US',
        streetAddress: metadata.street_address || '',
        city: metadata.city || '',
        state: metadata.state || '',
        zipCode: metadata.zip_code || '',
        country: metadata.country || 'United States',
      });
    }
  }, [user, reset]);

  // Update available states when country changes
  useEffect(() => {
    if (watchedCountryCode) {
      const states = statesProvinces[watchedCountryCode] || [];
      setAvailableStates(states);
    }
  }, [watchedCountryCode]);

  const onSubmit = async (data: EditUserFormData) => {
    setIsLoading(true);
    try {
      // Call the Supabase RPC function to update user profile
      const { data: result, error } = await supabase.rpc('admin_update_user_profile', {
        user_id_param: user.id,
        first_name_param: data.firstName,
        last_name_param: data.lastName,
        user_email: data.email,
        phone_number: data.phone || '',
        street_address_param: data.streetAddress || '',
        city_param: data.city || '',
        state_param: data.state || '',
        zip_code_param: data.zipCode || '',
        country_param: data.country,
        is_active_status: user.is_active ?? true,
      });

      if (error) {
        throw error;
      }

      // Create updated user object
      const updatedUser: User = {
        ...user,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        user_metadata: {
          ...user.user_metadata,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          country_code: data.countryCode,
          street_address: data.streetAddress,
          city: data.city,
          state: data.state,
          zip_code: data.zipCode,
          country: data.country,
        },
      };

      onUserUpdated(updatedUser);

      toast({
        title: 'User Updated',
        description: `${data.firstName} ${data.lastName}'s information has been updated successfully.`,
      });

      onCancel();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update user information. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPasswordReset = async () => {
    setIsSendingReset(true);
    try {
      const { error } = await supabase.functions.invoke('send-password-reset', {
        body: {
          email: user.email,
          resetUrl: `${window.location.origin}/auth/reset-password`,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Password Reset Sent',
        description: `A password reset link has been sent to ${user.email}`,
      });
    } catch (error: any) {
      console.error('Error sending password reset:', error);
      toast({
        title: 'Failed to Send Reset',
        description: error.message || 'Failed to send password reset email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personal Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              {...register('firstName')}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              {...register('lastName')}
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="countryCode">Country</Label>
            <Select
              value={watchedCountryCode}
              onValueChange={(value) => setValue('countryCode', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="Enter phone number"
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Address Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="streetAddress">Street Address</Label>
          <Input
            id="streetAddress"
            {...register('streetAddress')}
            placeholder="Enter street address"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...register('city')}
              placeholder="Enter city"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            {availableStates.length > 0 ? (
              <Select
                value={watch('state')}
                onValueChange={(value) => setValue('state', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {availableStates.map((state) => (
                    <SelectItem key={state.code} value={state.name}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="state"
                {...register('state')}
                placeholder="Enter state/province"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP/Postal Code</Label>
            <Input
              id="zipCode"
              {...register('zipCode')}
              placeholder="Enter ZIP code"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              {...register('country')}
              placeholder="Enter country"
            />
          </div>
        </div>
      </div>

      {/* Password Reset Section */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-medium">Account Actions</h3>
        <div className="flex flex-col space-y-2">
          <Label>Password Reset</Label>
          <p className="text-sm text-gray-600">
            Send a password reset link to the user's email address.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={handleSendPasswordReset}
            disabled={isSendingReset}
            className="w-fit"
          >
            {isSendingReset ? 'Sending...' : 'Send Password Reset Link'}
          </Button>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update User'}
        </Button>
      </div>
    </form>
  );
};
