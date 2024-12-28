
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
  handleSendEmail,
  handleUpdateSubscription
}) => {
  console.log('UserTable rendering with', users.length, 'users,', selectedUsers.length, 'selected');
  
  const { filterUsers } = useUserSearch(users);
  const filteredUsers = useMemo(() => filterUsers(users, searchTerm), [users, searchTerm, filterUsers]);

  const isAllSelected = filteredUsers.length > 0 && 
    selectedUsers.length === filteredUsers.length &&
    filteredUsers.every(user => selectedUsers.some(selectedUser => selectedUser.id === user.id));

  const handleToggleAll = () => {
    toggleAllUsers();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-full">
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
                      onSendEmail={handleSendEmail}
                      onUpdateSubscription={handleUpdateSubscription}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-500 px-2")}>
        <div>
          Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
          <span className="font-medium">{users.length}</span> users
        </div>
        <div>
          {selectedUsers.length > 0 && (
            <span className="font-medium">
              {selectedUsers.length} user{selectedUsers.length === 1 ? '' : 's'} selected
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
