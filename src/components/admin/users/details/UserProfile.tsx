
import React from 'react';
import { User } from '@/components/admin/users/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Mail, Phone, Calendar, MapPin, User as UserIcon, CreditCard } from 'lucide-react';
import { formatUserDisplayName, getUserPhone, getCountryFlag } from '../management/utils/userDisplayUtils';

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const userPhone = getUserPhone(user);
  const countryFlag = getCountryFlag(user);

  // Get address information from user metadata
  const addressInfo = {
    streetAddress: user.user_metadata?.street_address || '',
    city: user.user_metadata?.city || '',
    state: user.user_metadata?.state || '',
    zipCode: user.user_metadata?.zip_code || '',
    country: user.user_metadata?.country || user.country_code || ''
  };

  const hasAddress = addressInfo.streetAddress or addressInfo.city or addressInfo.state or addressInfo.zipCode;

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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      {hasAddress && (
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
                {addressInfo.streetAddress && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Street Address</h4>
                    <p className="text-sm">{addressInfo.streetAddress}</p>
                  </div>
                )}

                {addressInfo.city && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">City</h4>
                    <p className="text-sm">{addressInfo.city}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {addressInfo.state && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">State/Province</h4>
                    <p className="text-sm">{addressInfo.state}</p>
                  </div>
                )}

                {addressInfo.zipCode && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">ZIP/Postal Code</h4>
                    <p className="text-sm">{addressInfo.zipCode}</p>
                  </div>
                )}

                {addressInfo.country && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Country</h4>
                    <p className="text-sm">{addressInfo.country}</p>
                  </div>
                )}
              </div>
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
