
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { User } from '@/components/admin/users/types';
import UserActionMenu from './UserActionMenu';
import { formatDateRelative, formatUserDisplayName } from '../utils/userDisplayUtils';

interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  onToggleSelection: (user: User) => void;
  onViewDetails: (user: User) => void;
  onManagePermissions: (user: User) => void;
  onToggleUserActive: (userId: string, isActive: boolean) => void;
  onExtendSubscription: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onEditUser?: (user: User) => void;
  onSendEmail?: (user: User) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isSelected,
  onToggleSelection,
  onViewDetails,
  onManagePermissions,
  onToggleUserActive,
  onExtendSubscription,
  onDeleteUser,
  onEditUser,
  onSendEmail
}) => {
  const handleRowClick = () => {
    onViewDetails(user);
  };

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelection(user);
  };

  return (
    <TableRow 
      className={`${isSelected ? 'bg-muted/50' : ''} cursor-pointer hover:bg-muted/50`}
      onClick={handleRowClick}
    >
      <TableCell className="w-12">
        <Checkbox 
          checked={isSelected} 
          onCheckedChange={() => onToggleSelection(user)}
          onClick={handleCheckboxChange}
        />
      </TableCell>
      <TableCell className="font-medium">
        {formatUserDisplayName(user)}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell className="hidden md:table-cell">
        {user.user_metadata?.phone || '—'}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {user.subscription_tier ? (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">
            {user.subscription_tier}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-gray-600">
            Free
          </Badge>
        )}
      </TableCell>
      <TableCell className="hidden lg:table-cell">{formatDateRelative(user.created_at || '')}</TableCell>
      <TableCell className="hidden lg:table-cell">{formatDateRelative(user.last_sign_in_at || '')}</TableCell>
      <TableCell className="hidden md:table-cell">
        {user.is_active !== false ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
        ) : (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Inactive</Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        <UserActionMenu
          user={user}
          onViewDetails={onViewDetails}
          onManagePermissions={onManagePermissions}
          onToggleUserActive={onToggleUserActive}
          onExtendSubscription={onExtendSubscription}
          onDeleteUser={onDeleteUser}
          onEditUser={onEditUser}
          onSendEmail={onSendEmail}
        />
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
