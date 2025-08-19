
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { User } from '../../types';
import UserActionMenu from './UserActionMenu';

interface UserTableRowActionsProps {
  user: User;
  onViewDetails: (user: User) => void;
  onToggleAdmin: (user: User) => void;
  onToggleActive: (userId: string, isActive: boolean) => void;
  onDeleteUser: (userId: string) => void;
  onSendEmail?: (user: User) => void;
  onUpdateSubscription?: (user: User) => void;
}

export const UserTableRowActions: React.FC<UserTableRowActionsProps> = ({
  user,
  onViewDetails,
  onToggleAdmin,
  onToggleActive,
  onDeleteUser,
  onSendEmail,
  onUpdateSubscription
}) => (
  <TableCell className="px-2 text-right">
    <UserActionMenu
      user={user}
      onViewDetails={onViewDetails}
      onToggleAdmin={onToggleAdmin}
      onToggleUserActive={onToggleActive}
      onDeleteUser={onDeleteUser}
      onSendEmail={onSendEmail}
      onUpdateSubscription={onUpdateSubscription}
    />
  </TableCell>
);
