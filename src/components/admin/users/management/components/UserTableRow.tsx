import React from 'react';
import { User } from '../../types';
import { TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import UserActionMenu from './UserActionMenu';

interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  toggleUserSelection: (userId: string) => void;
  handleViewUserDetails: (user: User) => void;
  handleManagePermissions: (user: User) => void;
  handleToggleUserStatus: (userId: string, isActive: boolean) => void;
  handleToggleUserSubscription: (userId: string) => void;
  handleDeleteUser: (userId: string) => void;
  handleEditUser?: (user: User) => void;
  handleSendEmail?: (user: User) => void;
  handleUpdateSubscription?: (userId: string, plan: string, endDate: Date) => Promise<void>;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isSelected,
  toggleUserSelection,
  handleViewUserDetails,
  handleManagePermissions,
  handleToggleUserStatus,
  handleToggleUserSubscription,
  handleDeleteUser,
  handleEditUser,
  handleSendEmail,
  handleUpdateSubscription
}) => {
  return (
    <TableRow
      key={user.id}
      data-state={isSelected ? "selected" : undefined}
      onClick={() => handleViewUserDetails(user)}
      className="cursor-pointer"
    >
      <TableCell className="p-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => toggleUserSelection(user.id)}
          aria-label="Select user"
        />
      </TableCell>
      <TableCell className="font-medium">{user.user_metadata?.name || user.email}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.is_active !== false ? 'Active' : 'Inactive'}</TableCell>
      <TableCell>{user.subscription_tier || 'Free'}</TableCell>
      <TableCell className="p-2 text-center">
        <UserActionMenu
          user={user}
          onViewDetails={handleViewUserDetails}
          onManagePermissions={handleManagePermissions}
          onToggleUserActive={handleToggleUserStatus}
          onExtendSubscription={() => handleToggleUserSubscription(user.id)}
          onDeleteUser={handleDeleteUser}
          onEditUser={handleEditUser}
          onSendEmail={handleSendEmail}
          onUpdateSubscription={handleUpdateSubscription}
        />
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
