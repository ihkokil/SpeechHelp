
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

  // Format subscription plan for display with proper colors
  const formatSubscriptionPlan = (plan: string | null | undefined) => {
    const planType = plan || 'free_trial';
    const planName = planType === 'free_trial' ? 'Free Trial' : 
                     planType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    // Define colors for each plan
    let badgeClasses = '';
    switch (planType.toLowerCase()) {
      case 'free_trial':
        badgeClasses = 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
        break;
      case 'premium':
        badgeClasses = 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
        break;
      case 'pro':
        badgeClasses = 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
        break;
      default:
        badgeClasses = 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
    
    return { name: planName, classes: badgeClasses };
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

  // Get user phone and country flag
  const userPhone = getUserPhone(user);
  const countryFlag = getCountryFlag(user);
  const subscriptionPlan = formatSubscriptionPlan(user.subscription_plan);

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
          <span className="text-sm font-medium text-gray-900">{formatUserDisplayName(user)}</span>
        </div>
      </TableCell>
      
      <TableCell className="px-2">
        <span className="text-sm text-gray-900">{user.email}</span>
      </TableCell>
      
      <TableCell className="px-2">
        <div className="flex items-center text-sm text-gray-600">
          {userPhone !== '—' && <span className="mr-1">{countryFlag}</span>}
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
        <Badge variant="outline" className={subscriptionPlan.classes}>
          {subscriptionPlan.name}
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
