
import React, { useMemo } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { User } from '../types';
import { useUserSearch } from './hooks/useUserSearch';
import UserTableHeader from './components/UserTableHeader';
import UserTableRow from './components/UserTableRow';
import { LoadingState, EmptyState } from './components/UserTableStates';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  selectedUsers: string[];
  toggleUserSelection: (userId: string) => void;
  toggleAllUsers: () => void;
  handleViewUserDetails: (user: User) => void;
  handleManagePermissions: (user: User) => void;
  handleToggleUserStatus: (userId: string, isActive: boolean) => void;
  handleToggleUserSubscription: (userId: string, days: number) => void;
  setSelectedUsers: (users: string[]) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  searchTerm: string;
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
  searchTerm
}) => {
  console.log('UserTable rendering with', users.length, 'users,', selectedUsers.length, 'selected');
  
  const { filterUsers } = useUserSearch();
  const filteredUsers = useMemo(() => filterUsers(users, searchTerm), [users, searchTerm, filterUsers]);

  const viewUserDetails = (e: React.MouseEvent, user: User) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('UserTable: View details clicked for user:', user.id);
    handleViewUserDetails(user);
  };

  const managePermissions = (e: React.MouseEvent, user: User) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('UserTable: Manage permissions clicked for user:', user.id);
    handleManagePermissions(user);
  };

  const toggleUserActive = (e: React.MouseEvent, userId: string, isActive: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('UserTable: Toggling user status:', userId, isActive);
    handleToggleUserStatus(userId, isActive);
  };

  const extendSubscription = (e: React.MouseEvent, userId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('UserTable: Extending subscription for user:', userId);
    handleToggleUserSubscription(userId, 30);
  };

  const deleteUser = (e: React.MouseEvent, userId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('UserTable: Preparing to delete user:', userId);
    setSelectedUsers([userId]);
    setIsDeleteDialogOpen(true);
  };

  const isAllSelected = filteredUsers.length > 0 && 
    selectedUsers.length === filteredUsers.length &&
    filteredUsers.every(user => selectedUsers.includes(user.id));

  console.log('UserTable: Rendering with', filteredUsers.length, 'filtered users, all selected:', isAllSelected);

  return (
    <div className="rounded-md border">
      <Table>
        <UserTableHeader 
          onToggleAll={() => toggleAllUsers()}
          isAllSelected={isAllSelected}
          disabled={isLoading || filteredUsers.length === 0}
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
                isSelected={selectedUsers.includes(user.id)}
                onToggleSelection={toggleUserSelection}
                onViewDetails={viewUserDetails}
                onManagePermissions={managePermissions}
                onToggleUserActive={toggleUserActive}
                onExtendSubscription={extendSubscription}
                onDeleteUser={deleteUser}
              />
            ))
          )}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between text-sm text-gray-500 p-4">
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
