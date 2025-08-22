
import React from 'react';
import { User } from '@/components/admin/users/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface AddressInfoProps {
  user: User;
}

export const AddressInfo: React.FC<AddressInfoProps> = ({ user }) => {
  // Get address information from user metadata - check all possible sources using bracket notation
  const metadata = user.user_metadata || {};
  const addressInfo = {
    streetAddress: metadata.street_address || metadata['address'] || '',
    city: metadata.city || '',
    state: metadata.state || metadata['province'] || '',
    zipCode: metadata.zip_code || metadata['postal_code'] || '',
    country: metadata.country || user.country_code || ''
  };

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
