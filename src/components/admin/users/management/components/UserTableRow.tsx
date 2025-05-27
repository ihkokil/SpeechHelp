
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { User } from '../../types';
import { formatUserDisplayName } from '../utils/userDisplayUtils';
import { UserActionMenu } from './UserActionMenu';

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
  const displayName = formatUserDisplayName(user);
  const joinDate = new Date(user.created_at).toLocaleDateString();

  return (
    <TableRow key={user.id} className={isSelected ? 'bg-muted/50' : ''}>
      <TableCell className="w-12">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelection(user)}
          aria-label={`Select ${user.email}`}
        />
      </TableCell>
      
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{displayName}</span>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </div>
      </TableCell>
      
      <TableCell>{joinDate}</TableCell>
      
      <TableCell>
        <Badge variant={user.is_active ? 'default' : 'secondary'}>
          {user.is_active ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>
      
      <TableCell>
        <Badge variant={user.is_admin ? 'destructive' : 'outline'}>
          {user.is_admin ? 'Admin' : 'User'}
        </Badge>
      </TableCell>
      
      <TableCell>
        <Badge variant="outline">
          {user.subscription_plan || 'Free'}
        </Badge>
      </TableCell>
      
      <TableCell>
        <UserActionMenu
          user={user}
          onViewDetails={onViewDetails}
          onManagePermissions={onManagePermissions}
          onToggleActive={onToggleActive}
          onDeleteUser={onDeleteUser}
          onSendEmail={onSendEmail}
          onUpdateSubscription={onUpdateSubscription}
        />
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
