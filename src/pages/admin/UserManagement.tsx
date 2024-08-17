
import React, { useEffect } from 'react';
import { useUserManagement } from '@/components/admin/users/management/useUserManagement';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserTable from '@/components/admin/users/management/UserTable';
import SearchToolbar from '@/components/admin/users/management/SearchToolbar';
import DeleteUserDialog from '@/components/admin/users/management/DeleteUserDialog';
import AddUserDialog from '@/components/admin/users/add-user/AddUserDialog';
import UserDetailsDrawer from '@/components/admin/users/details/UserDetailsDrawer';
import { AdminPermissionsDialog } from '@/components/admin/users/AdminPermissionsDialog';
import EditUserDialog from '@/components/admin/users/edit-user/EditUserDialog';

const UserManagement: React.FC = () => {
  // Import the custom hook to handle User Management functionality
  const {
    // Data states
    users,
    setUsers,
    filteredUsers,
    selectedUsers,
    searchTerm,
    setSearchTerm,
    isLoading,
    isActionLoading,
    
    // UI states
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    isDetailsOpen,
    selectedUser,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    
    // User selection actions
    toggleUserSelection,
    toggleAllUsers,
    
    // CRUD operations
    fetchUsers,
    handleDeleteUsers,
    handleDeleteUser,
    
    // User actions
    handleViewUserDetails,
    handleCloseUserDetails,
    handleToggleUserStatus,
    handleToggleUserSubscription,
    handleManagePermissions,
    handlePermissionsUpdated,
    handleEditUser,
    handleSendEmail,
    
    // Bulk actions
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate,
    
    // User creation
    addUser,
    
    // Cleanup
    cleanup
  } = useUserManagement();
  
  // Fetch users on initial load
  useEffect(() => {
    fetchUsers();
    
    // Clean up when component unmounts
    return cleanup;
  }, [fetchUsers, cleanup]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">View and manage all platform users</p>
        </div>
        <div className="hidden md:block">
          <Button onClick={() => setIsAddUserDialogOpen(true)}>Add New User</Button>
        </div>
      </div>
      
      <Separator className="mb-6" />
      
      {/* Search and Actions Toolbar */}
      <SearchToolbar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isLoading={isLoading}
        isActionLoading={isActionLoading}
        selectedCount={selectedUsers.length}
        onRefresh={fetchUsers}
        onAddUser={() => setIsAddUserDialogOpen(true)}
        onDeleteSelected={() => selectedUsers.length > 0 && setIsDeleteDialogOpen(true)}
        onActivateSelected={handleBulkActivate}
        onDeactivateSelected={handleBulkDeactivate}
      />
      
      {/* User Listing Table */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable
            users={users}
            isLoading={isLoading}
            selectedUsers={selectedUsers}
            searchTerm={searchTerm}
            toggleUserSelection={toggleUserSelection}
            toggleAllUsers={toggleAllUsers}
            handleViewUserDetails={handleViewUserDetails}
            handleManagePermissions={handleManagePermissions}
            handleToggleUserStatus={handleToggleUserStatus}
            handleToggleUserSubscription={handleToggleUserSubscription}
            setSelectedUsers={toggleAllUsers}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            handleBulkDelete={handleBulkDelete}
            handleBulkActivate={handleBulkActivate}
            handleBulkDeactivate={handleBulkDeactivate}
            handleDeleteUser={handleDeleteUser}
            handleEditUser={handleEditUser}
            handleSendEmail={handleSendEmail}
          />
        </CardContent>
      </Card>
      
      {/* Dialogs and Modals */}
      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteUsers}
        isLoading={isActionLoading}
        selectedCount={selectedUsers.length}
      />
      
      <AddUserDialog
        open={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
        onUserAdded={addUser}
      />
      
      {selectedUser && (
        <>
          <UserDetailsDrawer
            user={selectedUser}
            open={isDetailsOpen}
            onClose={handleCloseUserDetails}
          />
          
          <AdminPermissionsDialog
            user={selectedUser}
            open={isPermissionsDialogOpen}
            onOpenChange={setIsPermissionsDialogOpen}
            onSave={handlePermissionsUpdated}
          />

          <EditUserDialog 
            user={selectedUser}
            open={isEditUserDialogOpen}
            onOpenChange={setIsEditUserDialogOpen}
          />
        </>
      )}
    </div>
  );
};

export default UserManagement;
