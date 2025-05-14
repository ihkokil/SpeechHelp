import { useCallback, useEffect, useRef } from 'react';
import { useUserManagementData } from './hooks/useUserManagementData';
import { useUserSearch } from './hooks/useUserSearch';
import { useUserSelection } from './hooks/useUserSelection';
import { useUserActions } from './hooks/useUserActions';
import { useUserManagementUIState } from './hooks/useUserManagementUIState';
import { User } from '../types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useUserManagement = () => {
  console.log("Initializing useUserManagement");
  const isMounted = useRef(true);
  const { toast } = useToast();

  // Get user data operations
  const {
    users,
    setUsers,
    isLoading,
    fetchUsers,
    addUser
  } = useUserManagementData();
  
  // Get UI state management
  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen,
    isDetailsOpen,
    setIsDetailsOpen,
    selectedUser,
    setSelectedUser,
    resetUIState,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    isEmailDialogOpen,
    setIsEmailDialogOpen
  } = useUserManagementUIState();
  
  // User search functionality
  const { searchTerm, setSearchTerm, filteredUsers } = useUserSearch(users);
  
  // User selection functionality
  const { 
    selectedUsers, 
    setSelectedUsers, 
    toggleUserSelection,
    toggleAllUsers,
    clearSelection
  } = useUserSelection();
  
  // Get all user actions and their states from the useUserActions hook
  const {
    // Actions
    handleDeleteUsers: baseHandleDeleteUsers,
    handleBulkDelete: baseHandleBulkDelete,
    handleBulkActivate: baseHandleBulkActivate,
    handleBulkDeactivate: baseHandleBulkDeactivate,
    handleToggleUserStatus: baseHandleToggleUserStatus,
    handleToggleUserSubscription: baseHandleToggleUserSubscription,
    
    // States
    isActionLoading
  } = useUserActions();
  
  // Direct action handlers
  const handleViewUserDetails = useCallback((user: User) => {
    console.log("useUserManagement: View details called for user:", user.id);
    setSelectedUser(user);
    setIsDetailsOpen(true);
  }, [setSelectedUser, setIsDetailsOpen]);
  
  const handleCloseUserDetails = useCallback(() => {
    console.log("useUserManagement: Close details called");
    setIsDetailsOpen(false);
    setTimeout(() => {
      setSelectedUser(null);
    }, 300);
  }, [setIsDetailsOpen, setSelectedUser]);
  
  const handleManagePermissions = useCallback((user: User) => {
    console.log("useUserManagement: Manage permissions called for user:", user.id);
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  }, [setSelectedUser, setIsPermissionsDialogOpen]);
  
  const handlePermissionsUpdated = useCallback((updatedUser: User) => {
    console.log("useUserManagement: Permissions updated for user:", updatedUser.id);
    setUsers(prevUsers => 
      prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
    );
    setIsPermissionsDialogOpen(false);
  }, [setUsers, setIsPermissionsDialogOpen]);
  
  // Handle Edit User
  const handleEditUser = useCallback((user: User) => {
    console.log("useUserManagement: Edit user called for user:", user.id);
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  }, [setSelectedUser, setIsEditUserDialogOpen]);
  
  // Handle Send Email
  const handleSendEmail = useCallback((user: User) => {
    console.log("useUserManagement: Send email called for user:", user.id);
    setSelectedUser(user);
    setIsEmailDialogOpen(true);
    
    // For now, just show a toast notification since email dialog is not implemented
    toast({
      title: 'Email Function',
      description: `Email dialog for ${user.email} would open here.`,
    });
  }, [setSelectedUser, setIsEmailDialogOpen, toast]);
  
  // Wrapper functions to include users and setUsers
  const handleToggleUserStatus = useCallback((userId: string, isActive: boolean) => {
    console.log("useUserManagement: Toggle user status called for user:", userId, isActive);
    return baseHandleToggleUserStatus(userId, isActive, users, setUsers);
  }, [baseHandleToggleUserStatus, users, setUsers]);
  
  const handleToggleUserSubscription = useCallback((userId: string) => {
    console.log("useUserManagement: Toggle subscription called for user:", userId);
    return baseHandleToggleUserSubscription(userId, 30, users, setUsers);
  }, [baseHandleToggleUserSubscription, users, setUsers]);
  
  const handleDeleteUsers = useCallback(() => {
    baseHandleDeleteUsers(selectedUsers, users, setUsers);
    setIsDeleteDialogOpen(false);
  }, [baseHandleDeleteUsers, selectedUsers, users, setUsers, setIsDeleteDialogOpen]);
  
  const handleDeleteUser = useCallback((userId: string) => {
    const userToDelete = users.find(user => user.id === userId);
    if (userToDelete) {
      setSelectedUsers([userToDelete]);
      setIsDeleteDialogOpen(true);
    }
  }, [users, setSelectedUsers, setIsDeleteDialogOpen]);
  
  // Bulk actions
  const handleBulkDelete = useCallback(() => {
    baseHandleBulkDelete(selectedUsers, users, setUsers);
  }, [baseHandleBulkDelete, selectedUsers, users, setUsers]);
  
  const handleBulkActivate = useCallback(() => {
    baseHandleBulkActivate(selectedUsers, users, setUsers);
  }, [baseHandleBulkActivate, selectedUsers, users, setUsers]);
  
  const handleBulkDeactivate = useCallback(() => {
    baseHandleBulkDeactivate(selectedUsers, users, setUsers);
  }, [baseHandleBulkDeactivate, selectedUsers, users, setUsers]);
  
  // Add the handleUpdateSubscription function
  const handleUpdateSubscription = useCallback(async (userId: string, plan: string, endDate: Date) => {
    console.log("useUserManagement: Update subscription called for user:", userId, plan, endDate);
    
    if (!userId) return;
    
    try {
      // Format the date to ISO string for database storage
      const formattedEndDate = endDate.toISOString();
      
      // Update the user's subscription in the database
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          subscription_plan: plan, 
          subscription_end_date: formattedEndDate 
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { 
                ...user, 
                subscription_status: 'active',
                subscription_tier: plan,
                subscription_end_date: formattedEndDate 
              } 
            : user
        )
      );
      
      toast({
        title: 'Subscription Updated',
        description: `User's subscription has been updated to ${plan}.`,
      });
      
      return data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to update subscription. Please try again.',
        variant: 'destructive',
      });
    }
  }, [setUsers, toast]);
  
  // Cleanup function for component unmount
  const cleanup = useCallback(() => {
    setSelectedUsers([]);
    setSearchTerm('');
    resetUIState();
  }, [setSelectedUsers, setSearchTerm, resetUIState]);
  
  // Lifecycle hooks
  useEffect(() => {
    isMounted.current = true;
    
    // Fetch users on initial mount
    fetchUsers();
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchUsers]);
  
  return {
    // State
    users,
    setUsers,
    searchTerm,
    setSearchTerm,
    selectedUsers,
    setSelectedUsers,
    isLoading,
    isActionLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    selectedUser,
    isDetailsOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    isEmailDialogOpen,
    setIsEmailDialogOpen,
    filteredUsers,
    
    // Functions
    fetchUsers,
    toggleUserSelection,
    toggleAllUsers,
    handleDeleteUsers,
    handleDeleteUser,
    handleToggleUserStatus,
    handleViewUserDetails,
    handleCloseUserDetails,
    handleToggleUserSubscription,
    handleManagePermissions,
    handlePermissionsUpdated,
    handleBulkDelete,
    handleBulkActivate,
    handleBulkDeactivate,
    handleEditUser,
    handleSendEmail,
    cleanup,
    addUser,
    handleUpdateSubscription
  };
};
