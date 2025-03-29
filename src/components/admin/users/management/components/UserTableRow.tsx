
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { User } from '../../types';
import UserActionMenu from './UserActionMenu';
import { formatUserDisplayName, getUserPhone } from '../utils/userDisplayUtils';
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

  // Format joined date
  const formatJoinedDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Unknown';
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
      <TableCell className="w-12 px-2">
        <Checkbox
          checked={isSelected}
          onClick={handleCheckboxClick}
          aria-label={`Select ${formatUserDisplayName(user)}`}
        />
      </TableCell>
      
      <TableCell className="px-2">
        <div className="flex flex-col">
          <span className="text-sm font-medium">{formatUserDisplayName(user)}</span>
        </div>
      </TableCell>
      
      <TableCell className="px-2">
        <span className="text-sm">{user.email}</span>
      </TableCell>
      
      <TableCell className="px-2 hidden lg:table-cell">
        <span className="text-sm">{getUserPhone(user)}</span>
      </TableCell>
      
      <TableCell className="px-2 text-center">
        <Badge 
          variant={user.is_active !== false ? "default" : "secondary"}
          className={user.is_active !== false ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
        >
          {user.is_active !== false ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>
      
      <TableCell className="px-2 text-center">
        {user.is_admin ? (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Admin
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-gray-50 text-gray-700">
            User
          </Badge>
        )}
      </TableCell>
      
      <TableCell className="px-2 text-center hidden md:table-cell">
        <Badge variant="outline" className="bg-gray-50">
          {formatSubscriptionPlan(user.subscription_plan)}
        </Badge>
      </TableCell>
      
      <TableCell className="px-2 text-sm text-gray-600 hidden xl:table-cell">
        {formatJoinedDate(user.created_at)}
      </TableCell>
      
      <TableCell className="px-2 text-sm text-gray-600 hidden xl:table-cell">
        {formatLastSignIn(user.last_sign_in_at)}
      </TableCell>
      
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
    </TableRow>
  );
};

export default UserTableRow;
