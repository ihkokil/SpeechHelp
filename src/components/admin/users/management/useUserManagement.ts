import { useState, useEffect, useCallback, useRef } from 'react';
import { User } from '../types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export const useUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const isInitialMount = useRef(true);
  const { toast } = useToast();
  const { adminUser } = useAdminAuth();
  
  const fetchUsers = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchTime < 1000) {
      console.log('Debouncing fetch request');
      return; // Debounce fetch requests
    }
    
    setLastFetchTime(now);
    setIsLoading(true);
    try {
      console.log('Fetching users from Supabase auth');
      
      // Fetch users from auth.users via a Supabase function
      const { data: authUsersData, error: authUsersError } = await supabase.functions.invoke('fetch-users', {
        method: 'GET'
      });
      
      if (authUsersError) {
        console.error('Error fetching auth users:', authUsersError);
        toast({
          title: 'Error',
          description: 'Failed to load users. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      console.log('Fetched auth users with profiles:', authUsersData);
      
      // Map users with their profiles
      const mappedUsers: User[] = authUsersData.users.map((authUser: any) => {
        // Get the profile data from our enhanced structure
        const profile = authUser.profile || {};
        
        const user: User = {
          id: authUser.id,
          email: authUser.email || 'No email',
          last_sign_in_at: authUser.last_sign_in_at,
          created_at: authUser.created_at,
          updated_at: authUser.updated_at || null,
          app_metadata: {
            provider: authUser.app_metadata?.provider || 'email',
            providers: authUser.app_metadata?.providers || ['email'],
          },
          user_metadata: {
            name: profile.username || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
            full_name: authUser.user_metadata?.full_name || profile.username || '',
            first_name: authUser.user_metadata?.first_name || '',
            last_name: authUser.user_metadata?.last_name || '',
            email: authUser.email,
            phone: profile.phone || authUser.user_metadata?.phone || '',
            street_address: authUser.user_metadata?.street_address || '',
            city: authUser.user_metadata?.city || '',
            state: authUser.user_metadata?.state || '',
            zip_code: authUser.user_metadata?.zip_code || '',
            country: authUser.user_metadata?.country || '',
            country_code: authUser.user_metadata?.country_code || '',
          },
          is_active: profile.is_active !== false, // Default to true if not specified
          subscription_status: profile.subscription_plan ? 'active' : undefined,
          subscription_end_date: profile.subscription_end_date || undefined,
          subscription_tier: profile.subscription_plan || undefined,
        };
        
        return user;
      });
      
      // Add admin user if it doesn't exist and current user is admin
      const adminExists = mappedUsers.some(user => user.is_admin);
      if (!adminExists && adminUser) {
        mappedUsers.push({
          id: 'admin-id',
          email: adminUser.email || 'admin@speechhelp.ai',
          last_sign_in_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          app_metadata: {
            provider: 'email',
          },
          user_metadata: {
            name: adminUser.username,
            full_name: 'Admin User',
          },
          is_active: true,
          is_admin: true,
          admin_role: 'Super Admin',
          permissions: ['view_users', 'manage_users', 'view_speeches', 'manage_speeches', 'system_settings'],
        });
      }
      
      console.log('Mapped users with profiles:', mappedUsers);
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Exception fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users. Please check console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [adminUser, toast, lastFetchTime]);

  const toggleUserSelection = useCallback((userId: string) => {
    console.log('Toggling user selection:', userId);
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  }, []);

  const toggleAllUsers = useCallback(() => {
    console.log('Toggling all users selection');
    setSelectedUsers(prev => {
      const filteredUsers = users.filter(user => 
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (user.user_metadata?.name && user.user_metadata.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.user_metadata?.full_name && user.user_metadata.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      if (prev.length === filteredUsers.length) {
        return [];
      } else {
        return filteredUsers.map(user => user.id);
      }
    });
  }, [users, searchTerm]);

  const handleDeleteUsers = useCallback(async () => {
    console.log('Deleting users:', selectedUsers);
    setIsActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prevUsers => prevUsers.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
      
      toast({
        title: 'Success',
        description: `${selectedUsers.length} users have been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting users:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete users.',
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(false);
      setIsDeleteDialogOpen(false);
    }
  }, [selectedUsers, toast]);

  const handleToggleUserStatus = useCallback(async (userId: string, isActive: boolean) => {
    console.log('Toggling user status:', userId, isActive);
    setIsActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, is_active: isActive } : user
        )
      );
      
      toast({
        title: 'Success',
        description: `User status updated to ${isActive ? 'active' : 'inactive'}.`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status.',
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(false);
    }
  }, [toast]);

  const handleViewUserDetails = useCallback((user: User) => {
    console.log('UserManagement: Opening details for user:', user.id);
    
    // First close the drawer completely
    setIsDetailsOpen(false);
    
    // Then set the selected user
    setSelectedUser(user);
    
    // Then open the drawer after a short delay to ensure state updates are processed
    setTimeout(() => {
      setIsDetailsOpen(true);
      console.log('UserManagement: Details drawer should now be open');
    }, 50);
    
  }, []);

  const handleCloseUserDetails = useCallback(() => {
    console.log('UserManagement: Closing user details drawer');
    
    // Close the drawer first
    setIsDetailsOpen(false);
    
    // Clear the selected user after a short delay
    setTimeout(() => {
      setSelectedUser(null);
      console.log('UserManagement: Selected user cleared');
    }, 100);
  }, []);

  const handleToggleUserSubscription = useCallback(async (userId: string, extensionDays: number = 30) => {
    console.log('Extending subscription for user:', userId, 'by', extensionDays, 'days');
    setIsActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (user.id === userId) {
            const currentEndDate = user.subscription_end_date 
              ? new Date(user.subscription_end_date) 
              : new Date();
            
            currentEndDate.setDate(currentEndDate.getDate() + extensionDays);
            
            return { 
              ...user, 
              subscription_status: 'active',
              subscription_end_date: currentEndDate.toISOString() 
            };
          }
          return user;
        })
      );
      
      toast({
        title: 'Success',
        description: `User subscription extended by ${extensionDays} days.`,
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user subscription.',
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(false);
    }
  }, [toast]);

  const handleManagePermissions = useCallback((user: User) => {
    console.log('UserManagement: Opening permissions dialog for user:', user.id);
    
    // Close the permissions dialog first
    setIsPermissionsDialogOpen(false);
    
    // Set the selected user
    setSelectedUser(user);
    
    // Open the permissions dialog after a short delay
    setTimeout(() => {
      setIsPermissionsDialogOpen(true);
      console.log('UserManagement: Permissions dialog should now be open');
    }, 50);
  }, []);

  const handlePermissionsUpdated = useCallback((updatedUser: User) => {
    console.log('Permissions updated for user:', updatedUser.id);
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    
    toast({
      title: 'Permissions Updated',
      description: `${updatedUser.email}'s admin permissions have been updated.`,
    });
  }, [toast]);

  // Clear selected data when component unmounts
  useEffect(() => {
    return () => {
      console.log('useUserManagement cleanup');
      setSelectedUsers([]);
      setSelectedUser(null);
      setIsDetailsOpen(false);
      setIsPermissionsDialogOpen(false);
    };
  }, []);

  return {
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
  };
};
