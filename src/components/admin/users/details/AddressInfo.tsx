
import React from 'react';
import { User } from '@/components/admin/users/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface AddressInfoProps {
  user: User;
}

export const AddressInfo: React.FC<AddressInfoProps> = ({ user }) => {
  // Get address information from all possible sources with better fallback logic
  const metadata = user.user_metadata || {};
  const rawMetadata = user.raw_user_meta_data || {};
  const profile = (user as any).profile || {};
  
  // Debug: Log all the data sources to understand what's available
  console.log('AddressInfo Debug - All user data sources:', {
    userId: user.id,
    email: user.email,
    user_metadata: metadata,
    raw_user_meta_data: rawMetadata,
    profile: profile,
    direct_fields: {
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      country_code: user.country_code
    }
  });
  
  // Helper function to get the first non-empty value
  const getFirstNonEmpty = (...values: (string | undefined | null)[]): string => {
    for (const value of values) {
      if (value && typeof value === 'string' && value.trim() !== '') {
        return value.trim();
      }
    }
    return '';
  };
  
  // Extract address info with comprehensive fallbacks
  const addressInfo = {
    streetAddress: getFirstNonEmpty(
      profile.street_address,
      metadata.street_address,
      metadata.address,
      rawMetadata.street_address,
      rawMetadata.address
    ),
    city: getFirstNonEmpty(
      profile.city,
      metadata.city,
      rawMetadata.city
    ),
    state: getFirstNonEmpty(
      profile.state,
      metadata.state,
      metadata.province,
      rawMetadata.state,
      rawMetadata.province
    ),
    zipCode: getFirstNonEmpty(
      profile.zip_code,
      metadata.zip_code,
      metadata.postal_code,
      rawMetadata.zip_code,
      rawMetadata.postal_code
    ),
    country: getFirstNonEmpty(
      profile.country,
      metadata.country,
      rawMetadata.country,
      user.country_code
    )
  };

  // Enhanced debug logging
  console.log('AddressInfo Debug - Extracted address:', {
    userId: user.id,
    extractedAddress: addressInfo,
    hasAnyAddressData: Object.values(addressInfo).some(val => val !== ''),
    sources: {
      profile_address: {
        street_address: profile.street_address,
        city: profile.city,
        state: profile.state,
        zip_code: profile.zip_code,
        country: profile.country
      },
      metadata_address: {
        street_address: metadata.street_address,
        address: metadata.address,
        city: metadata.city,
        state: metadata.state,
        zip_code: metadata.zip_code,
        country: metadata.country
      },
      rawMetadata_address: {
        street_address: rawMetadata.street_address,
        address: rawMetadata.address,
        city: rawMetadata.city,
        state: rawMetadata.state,
        zip_code: rawMetadata.zip_code,
        country: rawMetadata.country
      }
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
            profile_keys: Object.keys(profile),
            extractedAddress: addressInfo,
            actual_values: {
              profile_street: profile.street_address,
              metadata_street: metadata.street_address,
              raw_street: rawMetadata.street_address,
              profile_city: profile.city,
              metadata_city: metadata.city,
              raw_city: rawMetadata.city
            }
          }, null, 2)}</pre>
        </div>
      </CardContent>
    </Card>
  );
};
