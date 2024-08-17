
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { User } from '@/components/admin/users/types';
import UserActionMenu from './UserActionMenu';
import { formatDateRelative, formatUserDisplayName, getUserPhone } from '../utils/userDisplayUtils';

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

  // Create a specialized handler for the checkbox cell
  const handleCheckboxCellClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelection(user);
  };

  return (
    <TableRow 
      className={`${isSelected ? 'bg-muted/50' : ''} cursor-pointer hover:bg-muted/50`}
      onClick={handleRowClick}
    >
      {/* Make the entire cell clickable for the checkbox, and stop propagation */}
      <TableCell 
        className="w-12 relative" 
        onClick={handleCheckboxCellClick}
      >
        {/* Position the checkbox absolutely to make the entire cell clickable */}
        <div className="flex items-center justify-center">
          <Checkbox 
            checked={isSelected}
            // We don't need onCheckedChange here since the cell click will handle it
          />
        </div>
      </TableCell>
      <TableCell className="font-medium">
        {formatUserDisplayName(user)}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell className="hidden md:table-cell">
        {getUserPhone(user)}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {user.is_admin ? (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200">
            Admin
          </Badge>
        ) : user.subscription_tier === 'premium' ? (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">
            Premium
          </Badge>
        ) : (
          <Badge variant="outline" className="text-gray-600">
            Free
          </Badge>
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {formatDateRelative(user.created_at || '')}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {formatDateRelative(user.last_sign_in_at || '')}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {user.is_active !== false ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
        ) : (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Inactive</Badge>
        )}
      </TableCell>
      <TableCell>
        <div onClick={(e) => e.stopPropagation()}>
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
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
