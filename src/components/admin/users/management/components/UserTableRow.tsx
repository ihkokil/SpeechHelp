
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { User } from '../../types';
import UserActionMenu from './UserActionMenu';
import { formatDateTimeDetailed, formatUserDisplayName, getUserPhone } from '../utils/userDisplayUtils';
import { Crown } from 'lucide-react';

interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  onToggleSelection: (user: User) => void;
  onViewDetails: (user: User) => void;
  onManagePermissions: (user: User) => void;
  onToggleActive: (userId: string, isActive: boolean) => void;
  onDeleteUser: (userId: string) => void;
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
  onSendEmail,
  onUpdateSubscription
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
      <TableCell 
        className="w-12" 
        onClick={handleCheckboxCellClick}
      >
        <div className="flex items-center justify-center">
          <Checkbox 
            checked={isSelected}
          />
        </div>
      </TableCell>
      <TableCell className="min-w-[180px] font-medium">
        <div className="truncate">
          {formatUserDisplayName(user)}
        </div>
      </TableCell>
      <TableCell className="min-w-[200px]">
        <div className="truncate text-sm">
          {user.email}
        </div>
      </TableCell>
      <TableCell className="min-w-[120px]">
        <div className="truncate text-sm">
          {getUserPhone(user)}
        </div>
      </TableCell>
      <TableCell className="w-24">
        <div className="flex justify-center">
          {user.is_admin ? (
            <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200 flex items-center gap-1 text-xs px-2 py-1">
              <Crown size={10} /> Admin
            </Badge>
          ) : user.subscription_plan === 'pro' ? (
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 text-xs px-2 py-1">
              Pro
            </Badge>
          ) : user.subscription_plan === 'premium' ? (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 text-xs px-2 py-1">
              Premium
            </Badge>
          ) : (
            <Badge variant="outline" className="text-gray-600 text-xs px-2 py-1">
              Free
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="min-w-[140px]">
        <div className="text-sm text-gray-600">
          {formatDateTimeDetailed(user.created_at || '')}
        </div>
      </TableCell>
      <TableCell className="min-w-[140px]">
        <div className="text-sm text-gray-600">
          {formatDateTimeDetailed(user.last_sign_in_at || '')}
        </div>
      </TableCell>
      <TableCell className="w-20">
        <div className="flex justify-center">
          {user.is_active !== false ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1">
              Active
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 text-xs px-2 py-1">
              Inactive
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="w-16">
        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
          <UserActionMenu
            user={user}
            onViewDetails={onViewDetails}
            onManagePermissions={onManagePermissions}
            onToggleUserActive={onToggleActive}
            onDeleteUser={onDeleteUser}
            onSendEmail={onSendEmail}
            onUpdateSubscription={onUpdateSubscription}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
