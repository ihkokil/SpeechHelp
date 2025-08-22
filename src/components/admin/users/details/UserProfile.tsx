
import React from 'react';
import { User } from '@/components/admin/users/types';
import { BasicProfileInfo } from './BasicProfileInfo';
import { AddressInfo } from './AddressInfo';
import { SubscriptionInfo } from './SubscriptionInfo';

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <BasicProfileInfo user={user} />
      <AddressInfo user={user} />
      <SubscriptionInfo user={user} />
    </div>
  );
};
