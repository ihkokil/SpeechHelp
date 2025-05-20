
import React, { useMemo } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { User } from '../types';
import { useUserSearch } from './hooks/useUserSearch';
import UserTableHeader from './components/UserTableHeader';
import UserTableRow from './components/UserTableRow';
import { LoadingState, EmptyState } from './components/UserTableStates';
import { cn } from '@/lib/utils';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  selectedUsers: User[];
  toggleUserSelection: (user: User) => void;
  toggleAllUsers: () => void;
  handleViewUserDetails: (user: User) => void;
  handleManagePermissions: (user: User) => void;
  handleToggleUserStatus: (userId: string, isActive: boolean) => void;
  setSelectedUsers: (users: User[]) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  searchTerm: string;
  handleBulkDelete: () => void;
  handleBulkActivate: () => void;
  handleBulkDeactivate: () => void;
  handleDeleteUser: (userId: string) => void;
  handleEditUser?: (user: User) => void;
  handleSendEmail?: (user: User) => void;
  handleUpdateSubscription?: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  selectedUsers,
  toggleUserSelection,
  toggleAllUsers,
  handleViewUserDetails,
  handleManagePermissions,
  handleToggleUserStatus,
  setSelectedUsers,
  setIsDeleteDialogOpen,
  searchTerm,
  handleBulkDelete,
  handleBulkActivate,
  handleBulkDeactivate,
  handleDeleteUser,
  handleEditUser,
  handleSendEmail,
  handleUpdateSubscription
}) => {
  console.log('UserTable rendering with', users.length, 'users,', selectedUsers.length, 'selected');
  
  const { filterUsers } = useUserSearch(users);
  const filteredUsers = useMemo(() => filterUsers(users, searchTerm), [users, searchTerm, filterUsers]);

  const isAllSelected = filteredUsers.length > 0 && 
    selectedUsers.length === filteredUsers.length &&
    filteredUsers.every(user => selectedUsers.some(selectedUser => selectedUser.id === user.id));

  // Fixed to not pass arguments when calling toggleAllUsers
  const handleToggleAll = () => {
    toggleAllUsers();
  };

  // Use UserTableRow component instead of inline render function
  return (
    <div className="rounded-md border">
      <Table>
        <UserTableHeader 
          onToggleAll={handleToggleAll}
          isAllSelected={isAllSelected}
          disabled={isLoading || filteredUsers.length === 0}
          selectedCount={selectedUsers.length}
        />
        <TableBody>
          {isLoading ? (
            <LoadingState />
          ) : filteredUsers.length === 0 ? (
            <EmptyState />
          ) : (
            filteredUsers.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                isSelected={selectedUsers.some(selectedUser => selectedUser.id === user.id)}
                onToggleSelection={toggleUserSelection}
                onViewDetails={handleViewUserDetails}
                onManagePermissions={handleManagePermissions}
                onToggleActive={handleToggleUserStatus}
                onDeleteUser={handleDeleteUser}
                onEditUser={handleEditUser}
                onSendEmail={handleSendEmail}
                onUpdateSubscription={handleUpdateSubscription}
              />
            ))
          )}
        </TableBody>
      </Table>
      <div className={cn("mt-4 flex justify-between text-sm text-gray-500 p-4")}>
        <div>Showing {filteredUsers.length} of {users.length} users</div>
        <div>
          {selectedUsers.length > 0 && (
            <span>{selectedUsers.length} users selected</span>
          )}
        </div>
      </div>
    </div>
  );
};
