
import React from 'react';
import { User } from '@/components/admin/users/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Mail, Phone, Calendar, Globe, User as UserIcon, Building } from 'lucide-react';
import { formatUserDisplayName, getUserPhone, getCountryFlag } from '../management/utils/userDisplayUtils';

interface BasicProfileInfoProps {
  user: User;
}

export const BasicProfileInfo: React.FC<BasicProfileInfoProps> = ({ user }) => {
  const userPhone = getUserPhone(user);
  const countryFlag = getCountryFlag(user);

  return (
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
  );
};
