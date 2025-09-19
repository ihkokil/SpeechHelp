
import React from 'react';
import { User } from '@/components/admin/users/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User as UserIcon, Crown, ShieldCheck, Clock } from 'lucide-react';
import { formatUserDisplayName } from '../management/utils/userDisplayUtils';
import { EditUserDialog } from './EditUserDialog';

interface UserHeaderProps {
  user: User;
  onUserUpdated?: (updatedUser: User) => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ user, onUserUpdated }) => {
  const displayName = formatUserDisplayName(user);
  const userJoinedDate = user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown';
  const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never';

  const handleUserUpdated = (updatedUser: User) => {
    if (onUserUpdated) {
      onUserUpdated(updatedUser);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">{displayName}</CardTitle>
              <CardDescription className="text-base">{user.email}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <EditUserDialog user={user} onUserUpdated={handleUserUpdated} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant={user.is_active ? "default" : "secondary"}>
            {user.is_active ? "Active" : "Inactive"}
          </Badge>
          
          {user.is_admin && (
            <Badge variant="destructive">
              <Crown className="h-3 w-3 mr-1" />
              Admin
            </Badge>
          )}
          
          <Badge variant="outline">
            <ShieldCheck className="h-3 w-3 mr-1" />
            {user.subscription_plan || 'Free Trial'}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Joined: {userJoinedDate}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Last sign in: {lastSignIn}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
