import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserManagement } from '@/components/admin/users/management/useUserManagement';
import { SearchToolbar } from '@/components/admin/users/management/SearchToolbar';
import { UserTable } from '@/components/admin/users/management/UserTable';
import { DeleteUserDialog } from '@/components/admin/users/management/DeleteUserDialog';
import UserDetailsDrawer from '@/components/admin/users/details/UserDetailsDrawer';
import AddUserDialog from '@/components/admin/users/add-user/AddUserDialog';
import EditUserDialog from '@/components/admin/users/edit-user/EditUserDialog';
import AdminPermissionsDialog from '@/components/admin/users/AdminPermissionsDialog';
import UpdateSubscriptionDialog from '@/components/admin/users/management/components/UpdateSubscriptionDialog';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/components/admin/users/types';

const UserManagement = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedUsers,
    setSelectedUsers,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    users,
    setUsers,
    isLoading,
    isActionLoading,
    selectedUser,
    setSelectedUser,
    isDetailsOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen,
    filteredUsers,
    fetchUsers,
    toggleUserSelection,
    toggleAllUsers: baseToggleAllUsers,
    handleDeleteUsers,
    handleDeleteUser,
    handleToggleUserStatus,
    handleViewUserDetails,
    handleCloseUserDetails,
    handleManagePermissions,
    handlePermissionsUpdated,
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate,
    handleSendEmail,
    cleanup,
    addUser,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    handleUpdateSubscription,
  } = useUserManagement();
  
  // New state for subscription dialog
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  
  const { toast } = useToast();
  
  // Clean up all state when component unmounts
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Handler for when a user is added via the AddUserDialog
  const handleUserAdded = (newUser: User) => {
    console.log("New user added:", newUser);
    if (addUser) {
      addUser(newUser);
      toast({
        title: "User added",
        description: `${newUser.email} has been added successfully.`
      });
    }
  };

  // Handler for when a user is updated via the EditUserDialog
  const handleUserUpdated = (updatedUser: User) => {
    console.log("User updated:", updatedUser);
    setUsers(prevUsers => 
      prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
    );
    toast({
      title: "User updated",
      description: `${updatedUser.email} has been updated successfully.`
    });
  };

  // Handler for opening the subscription dialog
  const handleOpenSubscriptionDialog = (user: User) => {
    console.log("Opening subscription dialog for user:", user.id);
    setSelectedUser(user);
    setIsSubscriptionDialogOpen(true);
  };

  // Handler for when a subscription is updated
  const handleSubscriptionUpdated = (userId: string, tier: string, endDate: Date) => {
    if (handleUpdateSubscription) {
      handleUpdateSubscription(userId, tier, endDate, users, setUsers);
    }
    setIsSubscriptionDialogOpen(false);
  };

  // Create a wrapped toggle all users function that handles filtered users
  const toggleAllUsersWithFilter = () => {
    if (selectedUsers.length === filteredUsers.length) {
      // If all filtered users are selected, deselect them all
      setSelectedUsers([]);
    } else {
      // Otherwise, select all filtered users
      setSelectedUsers([...filteredUsers]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage your application users, their roles, and permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <SearchToolbar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isLoading={isLoading}
            fetchUsers={fetchUsers}
            selectedUsers={selectedUsers}
            isActionLoading={isActionLoading}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            setIsAddUserDialogOpen={setIsAddUserDialogOpen}
          />
          
          <UserTable 
            users={filteredUsers}
            isLoading={isLoading}
            selectedUsers={selectedUsers}
            toggleUserSelection={toggleUserSelection}
            toggleAllUsers={toggleAllUsersWithFilter}
            handleViewUserDetails={handleViewUserDetails}
            handleManagePermissions={handleManagePermissions}
            handleToggleUserStatus={handleToggleUserStatus}
            setSelectedUsers={setSelectedUsers}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            searchTerm={searchTerm}
            handleBulkDelete={handleBulkDelete}
            handleBulkActivate={handleBulkActivate}
            handleBulkDeactivate={handleBulkDeactivate}
            handleDeleteUser={handleDeleteUser}
            handleSendEmail={handleSendEmail}
            handleUpdateSubscription={handleOpenSubscriptionDialog}
          />
        </CardContent>
      </Card>
      
      <DeleteUserDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteUsers}
        isLoading={isActionLoading}
        selectedCount={selectedUsers.length}
      />

      {selectedUser && (
        <UserDetailsDrawer 
          user={selectedUser} 
          open={isDetailsOpen} 
          onClose={handleCloseUserDetails} 
        />
      )}
      
      <AddUserDialog 
        open={isAddUserDialogOpen} 
        onOpenChange={setIsAddUserDialogOpen} 
        onUserAdded={handleUserAdded}
      />

      {isEditUserDialogOpen && selectedUser && (
        <EditUserDialog
          user={selectedUser}
          open={isEditUserDialogOpen}
          onOpenChange={setIsEditUserDialogOpen}
          onUserUpdated={handleUserUpdated}
        />
      )}

      {isPermissionsDialogOpen && selectedUser && (
        <AdminPermissionsDialog
          user={selectedUser}
          open={isPermissionsDialogOpen}
          onOpenChange={setIsPermissionsDialogOpen}
          onPermissionsUpdated={(updatedUser) => handlePermissionsUpdated(updatedUser)}
        />
      )}

      {/* Add the new subscription dialog */}
      {isSubscriptionDialogOpen && selectedUser && (
        <UpdateSubscriptionDialog
          user={selectedUser}
          open={isSubscriptionDialogOpen}
          onOpenChange={setIsSubscriptionDialogOpen}
          onSubscriptionUpdated={handleSubscriptionUpdated}
        />
      )}
    </div>
  );
};

export default UserManagement;
