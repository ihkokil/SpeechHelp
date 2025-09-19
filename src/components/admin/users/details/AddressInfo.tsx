
import React from 'react';
import { User } from '@/components/admin/users/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface AddressInfoProps {
  user: User;
}

export const AddressInfo: React.FC<AddressInfoProps> = ({ user }) => {
  console.log('🏠 AddressInfo Debug - User ID:', user.id);
  console.log('🏠 AddressInfo Debug - User object:', user);
  
  // Get address information from the profiles table dedicated columns
  const addressInfo = {
    streetAddress: user.address_street_address || '',
    city: user.address_city || '',
    state: user.address_state || '',
    zipCode: user.address_zip_code || '',
    country: user.address_country_code || ''
  };

  console.log('🏠 AddressInfo Debug - Final extracted address:', addressInfo);
  
  // Check if we have any address data at all
  const hasAnyAddressData = Object.values(addressInfo).some(value => value !== '');
  console.log('🏠 AddressInfo Debug - Has any address data:', hasAnyAddressData);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Address Information
        </CardTitle>
        <CardDescription>Billing and contact address details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasAnyAddressData && (
          <div className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-md">
            No address information available for this user.
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Street Address</h4>
              <p className="text-sm">{addressInfo.streetAddress || 'Not provided'}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">City</h4>
              <p className="text-sm">{addressInfo.city || 'Not provided'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">State/Province</h4>
              <p className="text-sm">{addressInfo.state || 'Not provided'}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">ZIP/Postal Code</h4>
              <p className="text-sm">{addressInfo.zipCode || 'Not provided'}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Country</h4>
              <p className="text-sm">{addressInfo.country || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
