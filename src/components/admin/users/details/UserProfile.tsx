
import React from 'react';
import { User } from '@/components/admin/users/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Mail, Phone, Calendar, MapPin, User as UserIcon, CreditCard, Globe, Building } from 'lucide-react';
import { formatUserDisplayName, getUserPhone, getCountryFlag } from '../management/utils/userDisplayUtils';

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const userPhone = getUserPhone(user);
  const countryFlag = getCountryFlag(user);

  // Get address information from user metadata - check multiple possible sources
  const addressInfo = {
    streetAddress: user.user_metadata?.street_address || user.user_metadata?.streetAddress || '',
    city: user.user_metadata?.city || '',
    state: user.user_metadata?.state || user.user_metadata?.province || '',
    zipCode: user.user_metadata?.zip_code || user.user_metadata?.zipCode || user.user_metadata?.postal_code || '',
    country: user.user_metadata?.country || user.country_code || ''
  };

  // Debug log to see what address data we have
  console.log('Address debug for user:', user.email, {
    user_metadata: user.user_metadata,
    addressInfo,
    hasAddress: addressInfo.streetAddress || addressInfo.city || addressInfo.state || addressInfo.zipCode
  });

  // Always show address section - even if some fields are empty
  const showAddressSection = true;

  return (
    <div className="space-y-6">
      {/* Basic Profile Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Basic Information
            </span>
            <Badge variant={user.is_active ? "default" : "secondary"}>
              {user.is_active ? "Active" : "Inactive"}
            </Badge>
          </CardTitle>
          <CardDescription>Personal details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Full Name</h4>
                <p className="text-sm font-medium">{formatUserDisplayName(user)}</p>
              </div>

              {user.first_name && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">First Name</h4>
                  <p className="text-sm">{user.first_name}</p>
                </div>
              )}

              {user.last_name && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Last Name</h4>
                  <p className="text-sm">{user.last_name}</p>
                </div>
              )}
              
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-500">Email Address</h4>
                  <p className="text-sm break-all">{user.email}</p>
                </div>
              </div>
              
              {userPhone !== '—' && (
                <div className="flex items-start space-x-2">
                  <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
                    <p className="text-sm">
                      {countryFlag} {userPhone}
                    </p>
                  </div>
                </div>
              )}

              {user.username && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Username</h4>
                  <p className="text-sm">{user.username}</p>
                </div>
              )}

              {user.country_code && (
                <div className="flex items-start space-x-2">
                  <Globe className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-500">Country Code</h4>
                    <p className="text-sm">{countryFlag} {user.country_code}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-500">Member Since</h4>
                  <p className="text-sm">
                    {format(new Date(user.created_at), 'PPP')}
                  </p>
                </div>
              </div>

              {user.last_sign_in_at && (
                <div className="flex items-start space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-500">Last Sign In</h4>
                    <p className="text-sm">
                      {format(new Date(user.last_sign_in_at), 'PPP p')}
                    </p>
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Account Role</h4>
                <Badge variant={user.is_admin ? "destructive" : "outline"}>
                  {user.is_admin ? "Administrator" : "User"}
                </Badge>
              </div>

              {user.stripe_customer_id && (
                <div className="flex items-start space-x-2">
                  <Building className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-500">Stripe Customer ID</h4>
                    <p className="text-sm font-mono text-xs">{user.stripe_customer_id}</p>
                  </div>
                </div>
              )}

              {user.avatar_url && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Avatar URL</h4>
                  <p className="text-sm break-all text-blue-600">{user.avatar_url}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information - Always show this section */}
      {showAddressSection && (
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

            {/* Debug section - show raw metadata */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Raw User Metadata (Debug)</h4>
              <pre className="text-xs text-gray-600 overflow-auto max-h-32">
                {JSON.stringify(user.user_metadata, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscription Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Details
          </CardTitle>
          <CardDescription>Current subscription plan and status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Current Plan</h4>
                <Badge variant="outline" className="capitalize">
                  {user.subscription_plan || 'Free Trial'}
                </Badge>
              </div>

              {user.subscription_status && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
                  <Badge variant={user.subscription_status === 'active' ? 'default' : 'secondary'} className="capitalize">
                    {user.subscription_status}
                  </Badge>
                </div>
              )}

              {user.subscription_amount && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Amount</h4>
                  <p className="text-sm">
                    ${(user.subscription_amount / 100).toFixed(2)} {user.subscription_currency?.toUpperCase() || 'USD'}
                  </p>
                </div>
              )}

              {user.subscription_period && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Billing Period</h4>
                  <p className="text-sm capitalize">{user.subscription_period}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {user.subscription_start_date && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Started</h4>
                  <p className="text-sm">
                    {format(new Date(user.subscription_start_date), 'PPP')}
                  </p>
                </div>
              )}

              {user.subscription_end_date && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Expires</h4>
                  <p className="text-sm">
                    {format(new Date(user.subscription_end_date), 'PPP')}
                  </p>
                </div>
              )}

              {user.stripe_subscription_id && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Stripe Subscription ID</h4>
                  <p className="text-sm font-mono text-xs">{user.stripe_subscription_id}</p>
                </div>
              )}

              {user.subscription_price_id && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Price ID</h4>
                  <p className="text-sm font-mono text-xs">{user.subscription_price_id}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
