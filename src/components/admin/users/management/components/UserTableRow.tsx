
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { User } from '../../types';
import UserActionMenu from './UserActionMenu';
import { formatUserDisplayName } from '../utils/userDisplayUtils';
import { format } from 'date-fns';

interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  onToggleSelection: (user: User) => void;
  onViewDetails: (user: User) => void;
  onToggleAdmin: (user: User) => void;
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
  onToggleAdmin,
  onToggleActive,
  onDeleteUser,
  onSendEmail,
  onUpdateSubscription
}) => {
  // Handle checkbox click without triggering row selection
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelection(user);
  };

  // Handle row click to view details
  const handleRowClick = () => {
    onViewDetails(user);
  };

  // Format subscription plan for display
  const formatSubscriptionPlan = (plan: string | null | undefined) => {
    if (!plan || plan === 'free_trial') return 'Free Trial';
    return plan.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Format last sign in date
  const formatLastSignIn = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <TableRow 
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleRowClick}
    >
      <TableCell className="w-12">
        <Checkbox
          checked={isSelected}
          onClick={handleCheckboxClick}
          aria-label={`Select ${formatUserDisplayName(user)}`}
        />
      </TableCell>
      
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{formatUserDisplayName(user)}</span>
          <span className="text-xs text-gray-500">{user.email}</span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-2">
          <Badge 
            variant={user.is_active !== false ? "default" : "secondary"}
            className={user.is_active !== false ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
          >
            {user.is_active !== false ? 'Active' : 'Inactive'}
          </Badge>
          {user.is_admin && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Admin
            </Badge>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        <Badge variant="outline" className="bg-gray-50">
          {formatSubscriptionPlan(user.subscription_plan)}
        </Badge>
      </TableCell>
      
      <TableCell className="text-sm text-gray-600">
        {formatLastSignIn(user.last_sign_in_at)}
      </TableCell>
      
      <TableCell className="text-right">
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
    </TableRow>
  );
};

export default UserTableRow;
