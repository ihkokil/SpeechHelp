
import React from 'react';
import { User } from '@/components/admin/users/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Mail, Phone, Calendar } from 'lucide-react';
import { formatUserDisplayName, getUserPhone, getCountryFlag } from '../management/utils/userDisplayUtils';

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const userPhone = getUserPhone(user);
  const countryFlag = getCountryFlag(user);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Profile Information</span>
          <Badge variant={user.is_active ? "default" : "secondary"}>
            {user.is_active ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
        <CardDescription>User account details and contact information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Full Name</h4>
              <p className="text-sm">{formatUserDisplayName(user)}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
            
            {userPhone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                  <p className="text-sm">
                    {countryFlag} {userPhone}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <h4 className="text-sm font-medium text-gray-500">Joined</h4>
                <p className="text-sm">
                  {format(new Date(user.created_at), 'PPP')}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Role</h4>
              <Badge variant={user.is_admin ? "destructive" : "outline"}>
                {user.is_admin ? "Admin" : "User"}
              </Badge>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Subscription</h4>
              <Badge variant="outline">
                {user.subscription_plan || 'Free Trial'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
