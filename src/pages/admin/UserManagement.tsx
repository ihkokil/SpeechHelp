
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserManagement } from '@/components/admin/users/management/useUserManagement';
import { SearchToolbar } from '@/components/admin/users/management/SearchToolbar';
import { UserTable } from '@/components/admin/users/management/UserTable';
import { DeleteUserDialog } from '@/components/admin/users/management/DeleteUserDialog';
import UserDetailsDrawer from '@/components/admin/users/UserDetailsDrawer';
import AddUserDialog from '@/components/admin/users/AddUserDialog';
import AdminPermissionsDialog from '@/components/admin/users/AdminPermissionsDialog';

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
    isDetailsOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen,
    fetchUsers,
    toggleUserSelection,
    toggleAllUsers,
    handleDeleteUsers,
    handleToggleUserStatus,
    handleViewUserDetails,
    handleCloseUserDetails,
    handleToggleUserSubscription,
    handleManagePermissions,
    handlePermissionsUpdated
  } = useUserManagement();

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
            users={users}
            isLoading={isLoading}
            selectedUsers={selectedUsers}
            toggleUserSelection={toggleUserSelection}
            toggleAllUsers={toggleAllUsers}
            handleViewUserDetails={handleViewUserDetails}
            handleManagePermissions={handleManagePermissions}
            handleToggleUserStatus={handleToggleUserStatus}
            handleToggleUserSubscription={handleToggleUserSubscription}
            setSelectedUsers={setSelectedUsers}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            searchTerm={searchTerm}
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
          key={`user-drawer-${selectedUser.id}-${isDetailsOpen}`}
          user={selectedUser} 
          open={isDetailsOpen} 
          onClose={handleCloseUserDetails} 
        />
      )}
      
      <AddUserDialog 
        open={isAddUserDialogOpen} 
        onOpenChange={setIsAddUserDialogOpen} 
        onUserAdded={(newUser) => {
          setUsers(prev => [...prev, newUser]);
          setIsAddUserDialogOpen(false);
        }}
      />

      <AdminPermissionsDialog
        user={selectedUser}
        open={isPermissionsDialogOpen}
        onOpenChange={setIsPermissionsDialogOpen}
        onPermissionsUpdated={handlePermissionsUpdated}
      />
    </div>
  );
};

export default UserManagement;
