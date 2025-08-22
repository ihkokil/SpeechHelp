
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
  onRequestAdminPassword,
  onToggleActive,
  onDeleteUser,
  onSendEmail,
  onUpdateSubscription
}) => {
  // Handle row click to view details
  const handleRowClick = () => {
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
        onToggleActive={onToggleActive}
        onDeleteUser={onDeleteUser}
        onSendEmail={onSendEmail}
        onUpdateSubscription={onUpdateSubscription}
      />
    </TableRow>
  );
};

export default UserTableRow;
