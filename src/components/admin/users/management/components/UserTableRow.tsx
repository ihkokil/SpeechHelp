
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { User } from '../../types';
import UserActionMenu from './UserActionMenu';
import { formatDate, getUserName, getUserPhone } from '../utils/userDisplayUtils';

interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  onToggleSelection: (user: User) => void;
  onViewDetails: (e: React.MouseEvent, user: User) => void;
  onManagePermissions: (e: React.MouseEvent, user: User) => void;
  onToggleUserActive: (e: React.MouseEvent, userId: string, isActive: boolean) => void;
  onExtendSubscription: (e: React.MouseEvent, userId: string) => void;
  onDeleteUser: (e: React.MouseEvent, userId: string) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isSelected,
  onToggleSelection,
  onViewDetails,
  onManagePermissions,
  onToggleUserActive,
  onExtendSubscription,
  onDeleteUser
}) => {
  const fullName = getUserName(user);
  
  return (
    <TableRow key={user.id}>
      <TableCell>
        <Checkbox 
          checked={isSelected} 
          onCheckedChange={() => onToggleSelection(user)} 
        />
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex items-center">
          <span>{fullName}</span>
          {user.is_admin && (
            <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-800 border-purple-300">
              Admin
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{getUserPhone(user)}</TableCell>
      <TableCell>
        <Badge 
          variant="outline" 
          className={`min-w-[70px] justify-center inline-flex ${
            user.subscription_status === 'active' 
              ? 'bg-blue-100 text-blue-800 border-blue-300' 
              : ''
          }`}
        >
          {user.subscription_tier || 'free'}
        </Badge>
      </TableCell>
      <TableCell>{formatDate(user.created_at)}</TableCell>
      <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
      <TableCell>
        <Badge 
          variant={user.is_active !== false ? 'default' : 'secondary'}
          className={user.is_active !== false ? 'bg-green-500' : ''}
        >
          {user.is_active !== false ? 'active' : 'inactive'}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <UserActionMenu 
          user={user}
          onViewDetails={onViewDetails}
          onManagePermissions={onManagePermissions}
          onToggleUserActive={onToggleUserActive}
          onExtendSubscription={onExtendSubscription}
          onDeleteUser={onDeleteUser}
        />
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
