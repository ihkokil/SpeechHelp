
import React, { useMemo } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { User } from '../types';
import { useUserSearch } from './hooks/useUserSearch';
import UserTableHeader from './components/UserTableHeader';
import UserTableRow from './components/UserTableRow';
import UserTablePagination from './components/UserTablePagination';
import { LoadingState, EmptyState } from './components/UserTableStates';
import { usePagination } from './hooks/usePagination';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  selectedUsers: User[];
  toggleUserSelection: (user: User) => void;
  toggleAllUsers: (filteredUsers: User[]) => void;
  handleViewUserDetails: (user: User) => void;
  handleManagePermissions: (user: User) => void;
  handleToggleUserStatus: (userId: string, isActive: boolean) => void;
  handleToggleUserSubscription: (userId: string) => void;
  setSelectedUsers: (users: User[]) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  searchTerm: string;
  handleBulkDelete: () => void;
  handleBulkActivate: () => void;
  handleBulkDeactivate: () => void;
  handleDeleteUser: (userId: string) => void;
  handleEditUser?: (user: User) => void;
  handleSendEmail?: (user: User) => void;
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
  handleToggleUserSubscription, 
  setSelectedUsers, 
  setIsDeleteDialogOpen,
  searchTerm,
  handleBulkDelete,
  handleDeleteUser,
  handleEditUser,
  handleSendEmail,
  handleBulkActivate,
  handleBulkDeactivate
}) => {
  console.log('UserTable rendering with', users.length, 'users,', selectedUsers.length, 'selected');
  
  const { filterUsers } = useUserSearch(users);
  const filteredUsers = useMemo(() => filterUsers(users, searchTerm), [users, searchTerm, filterUsers]);
  
  // Use pagination hook
  const {
    currentItems: paginatedUsers,
    currentPage,
    pageSize,
    totalPages,
    handlePageChange,
    handlePageSizeChange
  } = usePagination(filteredUsers, 10);

  const isAllSelected = paginatedUsers.length > 0 && 
    selectedUsers.length >= paginatedUsers.length &&
    paginatedUsers.every(user => selectedUsers.some(selectedUser => selectedUser.id === user.id));

  const handleToggleAll = () => {
    toggleAllUsers(paginatedUsers);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <UserTableHeader 
          onToggleAll={handleToggleAll}
          isAllSelected={isAllSelected}
          disabled={isLoading || paginatedUsers.length === 0}
          selectedCount={selectedUsers.length}
          onBulkDelete={handleBulkDelete}
        />
        <TableBody>
          {isLoading ? (
            <LoadingState />
          ) : filteredUsers.length === 0 ? (
            <EmptyState />
          ) : (
            paginatedUsers.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                isSelected={selectedUsers.some(selectedUser => selectedUser.id === user.id)}
                onToggleSelection={toggleUserSelection}
                onViewDetails={handleViewUserDetails}
                onManagePermissions={handleManagePermissions}
                onToggleUserActive={handleToggleUserStatus}
                onExtendSubscription={handleToggleUserSubscription}
                onDeleteUser={handleDeleteUser}
                onEditUser={handleEditUser}
                onSendEmail={handleSendEmail}
              />
            ))
          )}
        </TableBody>
      </Table>
      
      <UserTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        totalItems={filteredUsers.length}
      />
    </div>
  );
};
