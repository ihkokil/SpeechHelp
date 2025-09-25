
import React from 'react';
import { TableRow } from '@/components/ui/table';
import { User } from '../../types';
import { 
  SelectionCell, 
  NameCell, 
  EmailCell, 
  PhoneCell, 
  StatusCell, 
  RoleCell, 
  SubscriptionCell, 
  DateCell 
} from './UserTableCells';
import { UserTableRowActions } from './UserTableRowActions';

interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  onToggleSelection: (user: User) => void;
  onViewDetails: (user: User) => void;
  onToggleAdmin: (user: User) => void;
  onRequestAdminPassword?: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onSendEmail?: (user: User) => void;
  onUpdateSubscription?: (user: User) => void;
  onUserDeleted?: () => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isSelected,
  onToggleSelection,
  onViewDetails,
  onToggleAdmin,
  onRequestAdminPassword,
  onDeleteUser,
  onSendEmail,
  onUpdateSubscription,
  onUserDeleted
}) => {
  // FIXED: Handle row click to view details with proper event handling
  const handleRowClick = (e: React.MouseEvent) => {
    // Only trigger if clicking on the row itself, not on interactive elements
    const target = e.target as HTMLElement;
    
    // Don't trigger row click if clicking on buttons, dropdowns, checkboxes, or their children
    if (
      target.closest('button') ||
      target.closest('[role="menuitem"]') ||
      target.closest('input[type="checkbox"]') ||
      target.closest('[data-radix-collection-item]')
    ) {
      console.log('Row click ignored - clicked on interactive element');
      return;
    }
    
    console.log(`Row clicked for user: ${user.email}, opening details`);
    onViewDetails(user);
  };

  // Debug phone data
  console.log('🔍 UserTableRow phone debug for user:', {
    userId: user.id,
    email: user.email,
    phone: user.phone,
    country_code: user.country_code,
    user_metadata_phone: user.user_metadata?.phone
  });

  return (
    <TableRow 
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleRowClick}
    >
      <SelectionCell 
        user={user} 
        isSelected={isSelected} 
        onToggleSelection={onToggleSelection} 
      />
      
      <NameCell user={user} />
      
      <EmailCell user={user} />
      
      <PhoneCell user={user} />
      
      <StatusCell user={user} />
      
      <RoleCell user={user} />
      
      <SubscriptionCell user={user} />
      
      <DateCell 
        dateString={user.created_at} 
        fallbackKey="admin.status.unknown" 
      />
      
      <DateCell 
        dateString={user.last_sign_in_at} 
        fallbackKey="admin.status.never" 
      />
      
      <UserTableRowActions
        user={user}
        onViewDetails={onViewDetails}
        onToggleAdmin={onToggleAdmin}
        onRequestAdminPassword={onRequestAdminPassword}
        onDeleteUser={onDeleteUser}
        onSendEmail={onSendEmail}
        onUpdateSubscription={onUpdateSubscription}
        onUserDeleted={onUserDeleted}
      />
    </TableRow>
  );
};

export default UserTableRow;
