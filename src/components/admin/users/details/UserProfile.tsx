
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { User } from '../types';

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP p');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">User ID</p>
              <p className="text-sm break-all">{user.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="text-sm">{user.is_active !== false ? 'Active' : 'Inactive'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p className="text-sm">{formatDate(user.created_at)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-sm">{formatDate(user.updated_at)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Login</p>
              <p className="text-sm">{formatDate(user.last_sign_in_at) || 'Never'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Provider</p>
              <p className="text-sm">{user.app_metadata?.provider || 
                                    (user.app_metadata?.providers && user.app_metadata.providers[0]) || 
                                    'email'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">First Name</p>
              <p className="text-sm">{user.user_metadata?.first_name || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Name</p>
              <p className="text-sm">{user.user_metadata?.last_name || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
