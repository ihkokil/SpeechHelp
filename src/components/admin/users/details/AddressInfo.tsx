
import React from 'react';
import { User } from '@/components/admin/users/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface AddressInfoProps {
  user: User;
}

export const AddressInfo: React.FC<AddressInfoProps> = ({ user }) => {
  // Get address information from all possible sources
  const metadata = user.user_metadata || {};
  const rawMetadata = user.raw_user_meta_data || {};
  
  // Debug: Log all the data sources to understand what's available
  console.log('AddressInfo Debug - All user data sources:', {
    userId: user.id,
    email: user.email,
    user_metadata: metadata,
    raw_user_meta_data: rawMetadata,
    direct_fields: {
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      country_code: user.country_code
    }
  });
  
  // Extract address info from multiple sources with comprehensive fallbacks
  const addressInfo = {
    streetAddress: metadata.street_address || 
                  metadata.address || 
                  rawMetadata.street_address || 
                  rawMetadata.address || 
                  '',
    city: metadata.city || 
          rawMetadata.city || 
          '',
    state: metadata.state || 
           metadata.province || 
           rawMetadata.state || 
           rawMetadata.province || 
           '',
    zipCode: metadata.zip_code || 
             metadata.postal_code || 
             rawMetadata.zip_code || 
             rawMetadata.postal_code || 
             '',
    country: metadata.country || 
             rawMetadata.country || 
             user.country_code || 
             ''
  };

  // Enhanced debug logging
  console.log('AddressInfo Debug - Extracted address:', {
    userId: user.id,
    extractedAddress: addressInfo,
    hasAnyAddressData: Object.values(addressInfo).some(val => val && val.trim() !== ''),
    metadata_values: {
      street_address: metadata.street_address,
      city: metadata.city,
      state: metadata.state,
      zip_code: metadata.zip_code,
      country: metadata.country
    }
  });

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
        
        {/* Debug section - remove this after fixing */}
        <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
          <strong>Debug Info:</strong>
          <pre>{JSON.stringify({ 
            metadata_keys: Object.keys(metadata), 
            rawMetadata_keys: Object.keys(rawMetadata),
            extractedAddress: addressInfo,
            actual_metadata_values: {
              street_address: metadata.street_address,
              city: metadata.city,
              state: metadata.state,
              zip_code: metadata.zip_code,
              country: metadata.country
            }
          }, null, 2)}</pre>
        </div>
      </CardContent>
    </Card>
  );
};
