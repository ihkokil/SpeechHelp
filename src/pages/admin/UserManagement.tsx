
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserManagement } from '@/components/admin/users/management/useUserManagement';
import { useUserFilters } from '@/components/admin/users/management/hooks/useUserFilters';
import { SearchToolbar } from '@/components/admin/users/management/SearchToolbar';
import { UserTable } from '@/components/admin/users/management/UserTable';
import { DeleteUserDialog } from '@/components/admin/users/management/DeleteUserDialog';
import UserDetailsDrawer from '@/components/admin/users/details/UserDetailsDrawer';
import AddUserDialog from '@/components/admin/users/add-user/AddUserDialog';
import UpdateSubscriptionDialog from '@/components/admin/users/management/components/UpdateSubscriptionDialog';
import UserFilters from '@/components/admin/users/management/components/UserFilters';
import AdminPasswordDialog from '@/components/admin/users/management/components/AdminPasswordDialog';
import { useSimpleAdminToggle } from '@/components/admin/users/management/hooks/user-actions/useSimpleAdminToggle';
import { useIndividualUserActions } from '@/components/admin/users/management/hooks/user-actions/useIndividualUserActions';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/components/admin/users/types';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';

const UserManagement = () => {
  const { translate } = useTranslatedContent();
  
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
    selectedUser,
    setSelectedUser,
    isDetailsOpen,
    filteredUsers,
    fetchUsers,
    toggleUserSelection,
    toggleAllUsers: baseToggleAllUsers,
    handleDeleteUsers: baseHandleDeleteUsers,
    handleViewUserDetails,
    handleCloseUserDetails,
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate,
    handleSendEmail,
    cleanup,
    addUser,
    handleUpdateSubscription,
  } = useUserManagement();
  
  // Add user filters
  const {
    selectedStatus,
    selectedRole,
    selectedPlan,
    filteredUsers: filteredByFilters,
    setSelectedStatus,
    setSelectedRole,
    setSelectedPlan,
    clearFilters,
  } = useUserFilters(filteredUsers);
  
  // Use the consolidated individual user actions
  const { 
    isActionLoading, 
    handleDeleteUser
  } = useIndividualUserActions();
  
  // New state for subscription dialog
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  
  // New state for admin password dialog
  const [isAdminPasswordDialogOpen, setIsAdminPasswordDialogOpen] = useState(false);
  const [userForAdminToggle, setUserForAdminToggle] = useState<User | null>(null);
  
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

  // Handler for requesting admin password
  const handleRequestAdminPassword = (user: User) => {
    console.log("Requesting admin password for user:", user.id);
    setUserForAdminToggle(user);
    setIsAdminPasswordDialogOpen(true);
  };

  // Handler for admin toggle (called after password confirmation)
  const handleToggleAdmin = (user: User) => {
    baseHandleToggleAdmin(user, users, setUsers);
  };

  // REMOVED: handleToggleUserStatus - now handled directly in UserActionMenu

  // UPDATED: Simplified delete user handler (the new hook handles everything)
  const handleDeleteSingleUser = (userId: string) => {
    console.log("Delete user called for user:", userId);
    // The new delete functionality is handled entirely by the UserActionMenu
    // This is kept for compatibility but the actual deletion happens in the menu
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

  // NEW: Handler to refresh users after deletion
  const handleRefreshUsers = () => {
    console.log("Refreshing users list...");
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">{translate('admin.userManagement.title')}</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{translate('admin.userManagement.users')}</CardTitle>
          <CardDescription>{translate('admin.userManagement.description')}</CardDescription>
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
          
          <UserFilters
            selectedStatus={selectedStatus}
            selectedRole={selectedRole}
            selectedPlan={selectedPlan}
            onStatusChange={setSelectedStatus}
            onRoleChange={setSelectedRole}
            onPlanChange={setSelectedPlan}
            onClearFilters={clearFilters}
          />
          
          <UserTable 
            users={filteredByFilters}
            isLoading={isLoading}
            selectedUsers={selectedUsers}
            toggleUserSelection={toggleUserSelection}
            toggleAllUsers={toggleAllUsersWithFilter}
            handleViewUserDetails={handleViewUserDetails}
            handleToggleAdmin={handleToggleAdmin}
            setSelectedUsers={setSelectedUsers}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            searchTerm={searchTerm}
            handleBulkDelete={handleBulkDelete}
            handleBulkActivate={handleBulkActivate}
            handleBulkDeactivate={handleBulkDeactivate}
            handleDeleteUser={handleDeleteSingleUser}
            handleSendEmail={handleSendEmail}
            handleUpdateSubscription={handleOpenSubscriptionDialog}
            handleRequestAdminPassword={handleRequestAdminPassword}
            onRefreshUsers={handleRefreshUsers}
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

      {/* Add the admin password dialog */}
      <AdminPasswordDialog
        user={userForAdminToggle}
        open={isAdminPasswordDialogOpen}
        onOpenChange={setIsAdminPasswordDialogOpen}
        onConfirm={handleToggleAdmin}
      />
    </div>
  );
};

export default UserManagement;
