
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { User } from '../../types';
import UserActionMenu from './UserActionMenu';
import { formatUserDisplayName, getUserPhone, getCountryFlag } from '../utils/userDisplayUtils';
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

  // Format last sign in date with time
  const formatLastSignIn = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Format joined date with time
  const formatJoinedDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Unknown';
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get user data using simplified functions
  const userPhone = getUserPhone(user);
  const countryFlag = getCountryFlag(user);
  const displayName = formatUserDisplayName(user);

  console.log('🔍 UserTableRow rendering user:', {
    id: user.id,
    email: user.email,
    displayName,
    userPhone,
    countryFlag,
    profileData: {
      phone: user.phone,
      country_code: user.country_code,
      first_name: user.first_name,
      last_name: user.last_name
    }
  });

  return (
    <TableRow 
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleRowClick}
    >
      <TableCell className="w-12 px-2">
        <Checkbox
          checked={isSelected}
          onClick={handleCheckboxClick}
          aria-label={`Select ${displayName}`}
        />
      </TableCell>
      
      <TableCell className="px-2">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{displayName}</span>
        </div>
      </TableCell>
      
      <TableCell className="px-2">
        <span className="text-sm text-gray-900">{user.email}</span>
      </TableCell>
      
      <TableCell className="px-2">
        <div className="flex items-center text-sm text-gray-600">
          {userPhone !== '—' && countryFlag && (
            <span className="mr-1" title={`Country: ${user.country_code || 'Unknown'}`}>
              {countryFlag}
            </span>
          )}
          {userPhone}
        </div>
      </TableCell>
      
      <TableCell className="px-2 text-center">
        <Badge 
          variant={user.is_active !== false ? "default" : "secondary"}
          className={user.is_active !== false ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}
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
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            User
          </Badge>
        )}
      </TableCell>
      
      <TableCell className="px-2 text-center">
        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
          {formatSubscriptionPlan(user.subscription_plan)}
        </Badge>
      </TableCell>
      
      <TableCell className="px-2 text-sm text-gray-600">
        {formatJoinedDate(user.created_at)}
      </TableCell>
      
      <TableCell className="px-2 text-sm text-gray-600">
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
