
import React from 'react';
import { User } from '@/components/admin/users/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { formatUserDisplayName } from '../management/utils/userDisplayUtils';

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  // Helper function to format address
  const formatAddress = (user: User): string => {
    const parts = [];
    
    if (user.user_metadata?.street_address) {
      parts.push(user.user_metadata.street_address);
    }
    
    const cityStateParts = [];
    if (user.user_metadata?.city) {
      cityStateParts.push(user.user_metadata.city);
    }
    if (user.user_metadata?.state) {
      cityStateParts.push(user.user_metadata.state);
    }
    if (user.user_metadata?.zip_code) {
      cityStateParts.push(user.user_metadata.zip_code);
    }
    
    if (cityStateParts.length > 0) {
      parts.push(cityStateParts.join(', '));
    }
    
    if (user.user_metadata?.country) {
      parts.push(user.user_metadata.country);
    }
    
    return parts.length > 0 ? parts.join(', ') : 'Not provided';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Personal details and account information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Account Status</h3>
          <div>
            <Badge className={user.is_active !== false ? 'bg-green-500' : ''}>
              {user.is_active !== false ? 'Active' : 'Inactive'}
            </Badge>
            {user.is_admin && (
              <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-800 border-purple-300">
                Admin
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
            <p className="font-medium">{formatUserDisplayName(user)}</p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              {user.email || user.user_metadata?.email || 'Not provided'}
            </p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
            <p className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              {user.user_metadata?.phone || 'Not provided'}
            </p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
            <p className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="break-words">{formatAddress(user)}</span>
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Account Created</h3>
              <p className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {user.created_at ? format(new Date(user.created_at), 'PPP') : 'Unknown'}
              </p>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Last Sign In</h3>
              <p className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {user.last_sign_in_at ? format(new Date(user.last_sign_in_at), 'PPP p') : 'Never'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
