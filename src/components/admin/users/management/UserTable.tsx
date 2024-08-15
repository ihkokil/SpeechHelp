
import React from 'react';
import { useUserManagementData } from './hooks/useUserManagementData';
import { useUserSearch } from './hooks/useUserSearch';
import { useUserSelection } from './hooks/useUserSelection';
import { useFetchUsers } from './hooks/useFetchUsers';
import { useUserActions } from './hooks/useUserActions';
import { useUserManagementUIState } from './hooks/useUserManagementUIState';
import { Table, TableBody } from '@/components/ui/table';
import SearchToolbar from './SearchToolbar';
import UserTableHeader from './components/UserTableHeader';
import UserTableRow from './components/UserTableRow';
import UserTableStates from './components/UserTableStates';
import UserDetailsDrawer from '../details/UserDetailsDrawer';
import DeleteUserDialog from './DeleteUserDialog';
import { AdminPermissionsDialog } from '../AdminPermissionsDialog';
import ExtendSubscriptionDialog from './components/ExtendSubscriptionDialog';

const UserTable = () => {
  // Fetch and manage users data
  const { users, setUsers, isLoading, error, refetch } = useFetchUsers();
  const { filteredUsers, searchQuery, setSearchQuery } = useUserSearch(users);
  const { 
    selectedUsers, 
    toggleUserSelection, 
    toggleAllUsers, 
    areAllUsersSelected 
  } = useUserSelection(filteredUsers);
  
  // Custom hook for UI state management
  const { 
    isDeleteDialogOpen, 
    setIsDeleteDialogOpen,
    isDetailsOpen, 
    setIsDetailsOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen,
    isSubscriptionDialogOpen,
    setIsSubscriptionDialogOpen,
    selectedUser,
    setSelectedUser
  } = useUserManagementUIState();
  
  // User actions hook
  const { 
    handleDeleteUsers, 
    handleDeleteUser,
    handleViewUserDetails,
    handleCloseUserDetails,
    handleManagePermissions,
    handlePermissionsUpdated,
    handleToggleUserStatus,
    handleOpenSubscriptionDialog,
    handleSubscriptionUpdated,
    isActionLoading
  } = useUserActions();

  // Global user context
  const userContext = useUserManagementData();
  
  // Clear selection when users change
  React.useEffect(() => {
    // Clear selectedUsers when users change
    // toggleAllUsers(false);
  }, [users]);
  
  // Handle deleting multiple users
  const handleConfirmDelete = async () => {
    await handleDeleteUsers(
      selectedUser ? [selectedUser] : selectedUsers, 
      users, 
      setUsers
    );
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };
  
  // Handle deleting a single user from the action menu
  const handleDeleteSingleUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsDeleteDialogOpen(true);
    }
  };
  
  // Set current context for all hooks
  React.useEffect(() => {
    userContext.setUsers(users);
  }, [users]);
  
  // if (error) {
  //   return <div className="flex justify-center p-4">Error loading users: {error.message}</div>;
  // }

  return (
    <div className="space-y-4">
      <SearchToolbar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCount={selectedUsers.length}
        onDeleteSelected={() => setIsDeleteDialogOpen(true)}
        onRefresh={refetch}
        isLoading={isLoading}
      />
      
      <div className="rounded-md border">
        <Table>
          <UserTableHeader 
            isAllSelected={areAllUsersSelected}
            onToggleSelectAll={() => toggleAllUsers(!areAllUsersSelected)}
          />
          <TableBody>
            <UserTableStates 
              isLoading={isLoading} 
              isEmpty={filteredUsers.length === 0} 
              error={error}
              searchQuery={searchQuery}
            />
            {!isLoading && filteredUsers.map(user => (
              <UserTableRow
                key={user.id}
                user={user}
                isSelected={selectedUsers.some(selectedUser => selectedUser.id === user.id)}
                onToggleSelection={toggleUserSelection}
                onViewDetails={handleViewUserDetails}
                onManagePermissions={handleManagePermissions}
                onToggleUserActive={(userId, isActive) => 
                  handleToggleUserStatus(userId, isActive, users, setUsers)
                }
                onExtendSubscription={handleOpenSubscriptionDialog}
                onDeleteUser={handleDeleteSingleUser}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* User Details Drawer */}
      <UserDetailsDrawer 
        user={selectedUser}
        open={isDetailsOpen}
        onClose={handleCloseUserDetails}
      />
      
      {/* Delete User Dialog */}
      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmDelete}
        users={selectedUser ? [selectedUser] : selectedUsers}
        isLoading={isActionLoading}
      />
      
      {/* Admin Permissions Dialog */}
      <AdminPermissionsDialog 
        user={selectedUser}
        isOpen={isPermissionsDialogOpen}
        onClose={() => setIsPermissionsDialogOpen(false)}
        onSave={updatedUser => handlePermissionsUpdated(updatedUser, users, setUsers)}
      />

      {/* Subscription Dialog */}
      <ExtendSubscriptionDialog
        isOpen={isSubscriptionDialogOpen}
        onClose={() => setIsSubscriptionDialogOpen(false)}
        onConfirm={(userId, planType, endDate) => 
          handleSubscriptionUpdated(userId, planType, endDate, users, setUsers)
        }
        user={selectedUser}
        isLoading={isActionLoading}
      />
    </div>
  );
};

export default UserTable;
