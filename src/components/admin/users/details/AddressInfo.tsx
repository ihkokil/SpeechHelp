
import React from 'react';
import { User } from '@/components/admin/users/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface AddressInfoProps {
  user: User;
}

export const AddressInfo: React.FC<AddressInfoProps> = ({ user }) => {
  // Get address information from all possible sources with enhanced debugging
  const metadata = user.user_metadata || {};
  const rawMetadata = user.raw_user_meta_data || {};
  
  console.log('🏠 AddressInfo Debug - User ID:', user.id);
  console.log('🏠 AddressInfo Debug - user_metadata:', metadata);
  console.log('🏠 AddressInfo Debug - raw_user_meta_data:', rawMetadata);
  
  // Comprehensive address extraction with multiple field name variants
  const extractAddressField = (fieldVariants: string[]) => {
    // Check user_metadata first, then raw_user_meta_data
    for (const variant of fieldVariants) {
      if (metadata[variant] && String(metadata[variant]).trim()) {
        console.log(`🔍 Found ${variant} in user_metadata:`, metadata[variant]);
        return String(metadata[variant]).trim();
      }
    }
    for (const variant of fieldVariants) {
      if (rawMetadata[variant] && String(rawMetadata[variant]).trim()) {
        console.log(`🔍 Found ${variant} in raw_user_meta_data:`, rawMetadata[variant]);
        return String(rawMetadata[variant]).trim();
      }
    }
    return '';
  };
  
  // Extract address info with comprehensive field name support
  const addressInfo = {
    streetAddress: extractAddressField([
      'street_address', 'streetAddress', 'address'
    ]),
    city: extractAddressField([
      'city'
    ]),
    state: extractAddressField([
      'state', 'province', 'stateProvince'
    ]),
    zipCode: extractAddressField([
      'zip_code', 'zipCode', 'postal_code', 'postalCode'
    ]),
    country: extractAddressField([
      'country', 'country_code', 'countryCode'
    ]) || user.country_code || ''
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
              {!addressInfo.streetAddress && (
                <p className="text-xs text-gray-400 mt-1">
                  Checked: street_address, streetAddress, address
                </p>
              )}
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
              {!addressInfo.state && (
                <p className="text-xs text-gray-400 mt-1">
                  Checked: state, province, stateProvince
                </p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">ZIP/Postal Code</h4>
              <p className="text-sm">{addressInfo.zipCode || 'Not provided'}</p>
              {!addressInfo.zipCode && (
                <p className="text-xs text-gray-400 mt-1">
                  Checked: zip_code, zipCode, postal_code, postalCode
                </p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Country</h4>
              <p className="text-sm">{addressInfo.country || 'Not provided'}</p>
              {!addressInfo.country && (
                <p className="text-xs text-gray-400 mt-1">
                  Checked: country, country_code, countryCode
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Debug section - only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 p-4 bg-blue-50 rounded-md">
            <summary className="text-sm font-medium text-blue-800 cursor-pointer">
              Debug Information (Dev Only)
            </summary>
            <div className="mt-2 space-y-2 text-xs">
              <div>
                <strong>user_metadata keys:</strong> {Object.keys(metadata).join(', ') || 'None'}
              </div>
              <div>
                <strong>raw_user_meta_data keys:</strong> {Object.keys(rawMetadata).join(', ') || 'None'}
              </div>
              <div>
                <strong>Raw metadata sample:</strong>
                <pre className="mt-1 p-2 bg-white rounded text-xs overflow-auto">
                  {JSON.stringify(rawMetadata, null, 2)}
                </pre>
              </div>
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  );
};
