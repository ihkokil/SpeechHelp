
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserManagement } from '@/components/admin/users/management/useUserManagement';
import { SearchToolbar } from '@/components/admin/users/management/SearchToolbar';
import { UserTable } from '@/components/admin/users/management/UserTable';
import { DeleteUserDialog } from '@/components/admin/users/management/DeleteUserDialog';
import UserDetailsDrawer from '@/components/admin/users/details/UserDetailsDrawer';
import AddUserDialog from '@/components/admin/users/add-user/AddUserDialog';
import UpdateSubscriptionDialog from '@/components/admin/users/management/components/UpdateSubscriptionDialog';
import { useSimpleAdminToggle } from '@/components/admin/users/management/hooks/user-actions/useSimpleAdminToggle';
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
    filteredUsers,
    fetchUsers,
    refreshUsers,
    toggleUserSelection,
    toggleAllUsers: baseToggleAllUsers,
    handleDeleteUsers: baseHandleDeleteUsers,
    handleDeleteUser,
    handleToggleUserStatus,
    handleViewUserDetails,
    handleCloseUserDetails,
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate,
    handleSendEmail,
    cleanup,
    addUser,
    updateUser,
    handleUpdateSubscription,
    lastFetchTime,
  } = useUserManagement();
  
  // New state for subscription dialog
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  
  // Get the simple admin toggle hook
  const { handleToggleAdmin: baseHandleToggleAdmin } = useSimpleAdminToggle();
  
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
      // Refresh data after adding user
      setTimeout(() => refreshUsers(), 500);
    }
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

  // Handler for admin toggle
  const handleToggleAdmin = (user: User) => {
    baseHandleToggleAdmin(user, users, setUsers);
    // Refresh data after admin toggle
    setTimeout(() => refreshUsers(), 500);
  };

  // Create a wrapped toggle all users function that handles filtered users
  const toggleAllUsersWithFilter = () => {
    // This function will be handled by the UserTable component now
    // since it needs access to the current page data
    console.log("Toggle all users called - handled by UserTable component");
  };

  // Fixed delete users handler that properly executes deletion and closes dialog
  const handleConfirmDelete = async () => {
    console.log("Confirming deletion of", selectedUsers.length, "users");
    try {
      // Use the bulk delete handler which is designed for this purpose
      await handleBulkDelete();
      // Clear selection after successful deletion
      setSelectedUsers([]);
      // Close the dialog
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Users Deleted",
        description: `${selectedUsers.length} user(s) have been deleted successfully.`,
      });
    } catch (error) {
      console.error("Error during deletion:", error);
      toast({
        title: "Error",
        description: "Failed to delete users. Please try again.",
        variant: "destructive"
      });
      // Dialog will remain open on error so user can retry
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
            refreshUsers={refreshUsers}
            selectedUsers={selectedUsers}
            isActionLoading={isActionLoading}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            setIsAddUserDialogOpen={setIsAddUserDialogOpen}
            lastFetchTime={lastFetchTime}
          />
          
          <UserTable 
            users={filteredUsers}
            isLoading={isLoading}
            selectedUsers={selectedUsers}
            toggleUserSelection={toggleUserSelection}
            toggleAllUsers={toggleAllUsersWithFilter}
            handleViewUserDetails={handleViewUserDetails}
            handleToggleAdmin={handleToggleAdmin}
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
            lastFetchTime={lastFetchTime}
          />
        </CardContent>
      </Card>
      
      <DeleteUserDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
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

      {/* Add the subscription dialog */}
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
