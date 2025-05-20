
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { formatUserName, formatDateTimeForDisplay } from '../utils/userDisplayUtils';
import { User } from '../../types';
import UserActionMenu from './UserActionMenu';

export interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  onToggleSelection: (user: User) => void;
  onViewDetails: (user: User) => void;
  onManagePermissions: (user: User) => void;
  onToggleActive: (userId: string, isActive: boolean) => void;
  onDeleteUser: (userId: string) => void;
  onEditUser?: (user: User) => void;
  onSendEmail?: (user: User) => void;
  onUpdateSubscription?: (user: User) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isSelected,
  onToggleSelection,
  onViewDetails,
  onManagePermissions,
  onToggleActive,
  onDeleteUser,
  onEditUser,
  onSendEmail,
  onUpdateSubscription
}) => {
  const handleRowClick = () => {
    onViewDetails(user);
  };

  // Prevent checkbox from triggering row click
  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelection(user);
  };

  // Display name or email if no user_metadata name exists
  const displayName = formatUserName(user);
  
  return (
    <TableRow 
      onClick={handleRowClick}
      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
      data-testid={`user-row-${user.id}`}
    >
      <TableCell className="py-2">
        <div onClick={handleCheckboxChange} className="cursor-pointer">
          <Checkbox checked={isSelected} />
        </div>
      </TableCell>
      <TableCell className="py-2 font-medium">{displayName}</TableCell>
      <TableCell className="py-2">{user.email}</TableCell>
      <TableCell className="py-2">
        <div className="flex flex-wrap gap-1">
          {user.is_admin && (
            <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
              Admin
            </Badge>
          )}
          {user.subscription_tier && (
            <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
              {user.subscription_tier}
            </Badge>
          )}
          {user.is_active === false && (
            <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
              Inactive
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="py-2">
        {user.created_at && formatDateTimeForDisplay(user.created_at)}
      </TableCell>
      <TableCell className="py-2">
        <UserActionMenu 
          user={user}
          onViewDetails={onViewDetails}
          onManagePermissions={onManagePermissions}
          onToggleActive={onToggleActive}
          onDeleteUser={onDeleteUser}
          onEditUser={onEditUser}
          onSendEmail={onSendEmail}
          onUpdateSubscription={onUpdateSubscription}
        />
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
