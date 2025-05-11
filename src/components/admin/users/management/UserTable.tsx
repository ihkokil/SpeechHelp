import React, { useMemo, useEffect } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { User } from '../types';
import { useUserSearch } from './hooks/useUserSearch';
import { useUserTablePagination } from './hooks/useUserTablePagination';
import UserTableHeader from './components/UserTableHeader';
import UserTableRow from './components/UserTableRow';
import { LoadingState, EmptyState } from './components/UserTableStates';
import { PaginationControls } from './components/PaginationControls';
import { cn } from '@/lib/utils';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  selectedUsers: User[];
  toggleUserSelection: (user: User) => void;
  toggleAllUsers: () => void;
  handleViewUserDetails: (user: User) => void;
  handleToggleAdmin: (user: User) => void;
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
  lastFetchTime?: number;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  selectedUsers,
  toggleUserSelection,
  toggleAllUsers,
  handleViewUserDetails,
  handleToggleAdmin,
  handleToggleUserStatus,
  setSelectedUsers,
  setIsDeleteDialogOpen,
  searchTerm,
  handleBulkDelete,
  handleBulkActivate,
  handleBulkDeactivate,
  handleDeleteUser,
  handleSendEmail,
  handleUpdateSubscription,
  lastFetchTime
}) => {
  console.log('UserTable rendering with', users.length, 'users,', selectedUsers.length, 'selected');
  
  const { filterUsers } = useUserSearch(users);
  
  const {
    paginatedUsers,
    filteredUsers,
    currentPage,
    totalPages,
    itemsPerPage,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    handleItemsPerPageChange,
    totalFilteredItems,
    totalItems
  } = useUserTablePagination({
    users,
    searchTerm,
    filterUsers
  });

  // Reset pagination when search term changes
  useEffect(() => {
    // This is now handled in the useUserTablePagination hook
  }, [searchTerm]);

  const isAllSelected = paginatedUsers.length > 0 && 
    selectedUsers.length === filteredUsers.length &&
    filteredUsers.every(user => selectedUsers.some(selectedUser => selectedUser.id === user.id));

  const isPageAllSelected = paginatedUsers.length > 0 &&
    paginatedUsers.every(user => selectedUsers.some(selectedUser => selectedUser.id === user.id));

  const handleToggleAll = () => {
    if (isPageAllSelected) {
      // Deselect all users on current page
      const userIdsOnPage = paginatedUsers.map(user => user.id);
      const remainingSelected = selectedUsers.filter(user => !userIdsOnPage.includes(user.id));
      setSelectedUsers(remainingSelected);
    } else {
      // Select all users on current page (keep existing selections from other pages)
      const newSelections = paginatedUsers.filter(user => 
        !selectedUsers.some(selectedUser => selectedUser.id === user.id)
      );
      setSelectedUsers([...selectedUsers, ...newSelections]);
    }
  };

  // Format last update time for display
  const formatLastUpdateTime = () => {
    if (!lastFetchTime) return '';
    const now = Date.now();
    const diffSeconds = Math.floor((now - lastFetchTime) / 1000);
    
    if (diffSeconds < 60) return `Data updated ${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `Data updated ${Math.floor(diffSeconds / 60)}m ago`;
    return `Data updated ${Math.floor(diffSeconds / 3600)}h ago`;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white shadow-sm">
        {/* Horizontal scroll container for the table */}
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            <Table>
              <UserTableHeader 
                onToggleAll={handleToggleAll}
                isAllSelected={isPageAllSelected}
                disabled={isLoading || paginatedUsers.length === 0}
                selectedCount={selectedUsers.length}
              />
              <TableBody>
                {isLoading ? (
                  <LoadingState />
                ) : paginatedUsers.length === 0 ? (
                  <EmptyState />
                ) : (
                  paginatedUsers.map((user) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      isSelected={selectedUsers.some(selectedUser => selectedUser.id === user.id)}
                      onToggleSelection={toggleUserSelection}
                      onViewDetails={handleViewUserDetails}
                      onToggleAdmin={handleToggleAdmin}
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
        <div className="flex flex-col gap-1">
          <div>
            Showing <span className="font-medium">{totalFilteredItems}</span> of{' '}
            <span className="font-medium">{totalItems}</span> users
            {searchTerm && (
              <span className="ml-1">
                (filtered by "{searchTerm}")
              </span>
            )}
          </div>
          {lastFetchTime && (
            <div className="text-xs text-gray-400">
              {formatLastUpdateTime()}
            </div>
          )}
        </div>
        <div>
          {selectedUsers.length > 0 && (
            <span className="font-medium">
              {selectedUsers.length} user{selectedUsers.length === 1 ? '' : 's'} selected
            </span>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalFilteredItems}
        onPageChange={goToPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </div>
  );
};
