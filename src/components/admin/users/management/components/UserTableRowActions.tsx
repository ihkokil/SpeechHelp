
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { User } from '../../types';
import UserActionMenu from './UserActionMenu';

interface UserTableRowActionsProps {
  user: User;
  onViewDetails: (user: User) => void;
  onToggleAdmin: (user: User) => void;
  onRequestAdminPassword?: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onSendEmail?: (user: User) => void;
  onUpdateSubscription?: (user: User) => void;
  onUserDeleted?: () => void;
}

export const UserTableRowActions: React.FC<UserTableRowActionsProps> = ({
  user,
  onViewDetails,
  onToggleAdmin,
  onRequestAdminPassword,
  onDeleteUser,
  onSendEmail,
  onUpdateSubscription,
  onUserDeleted
}) => (
  <TableCell className="px-2 text-right">
    <UserActionMenu
      user={user}
      onViewDetails={onViewDetails}
      onToggleAdmin={onToggleAdmin}
      onRequestAdminPassword={onRequestAdminPassword}
      onDeleteUser={onDeleteUser}
      onSendEmail={onSendEmail}
      onUpdateSubscription={onUpdateSubscription}
      onUserDeleted={onUserDeleted}
    />
  </TableCell>
);
