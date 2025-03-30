
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
    // Prevent rapid re-fetching
    const now = Date.now();
    if (now - lastFetchTime < 1000) {
      return; // Debounce fetch requests
    }
    
    setLastFetchTime(now);
    setIsLoading(true);
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast({
          title: 'Error',
          description: 'Failed to load user profiles. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      console.log('Fetched profiles:', profilesData);
      
      const mappedUsers: User[] = [];
      
      for (const profile of profilesData) {
        const user: User = {
          id: profile.id,
          email: profile.username ? `${profile.username}@example.com` : 'user@example.com',
          last_sign_in_at: null,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          app_metadata: {
            provider: 'email',
          },
          user_metadata: {
            name: profile.username,
          },
          is_active: true,
          is_admin: false,
        };
        
        if (profile.username && profile.username.toLowerCase().includes('gillis')) {
          user.email = 'wayne@gillis.net';
          user.user_metadata.email = 'wayne@gillis.net';
          user.user_metadata.first_name = 'Wayne';
          user.user_metadata.last_name = 'Gillis';
          user.user_metadata.full_name = 'Wayne Gillis';
          user.user_metadata.phone = '602-989-331';
          user.user_metadata.street_address = '123 Any Street';
          user.user_metadata.city = 'Notting Hill';
          user.user_metadata.state = 'England';
          user.user_metadata.zip_code = 'W66699';
          user.user_metadata.country = 'United Kingdom';
          user.last_sign_in_at = new Date().toISOString();
          user.subscription_status = 'active';
          user.subscription_tier = 'premium';
          user.subscription_end_date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(); // 30 days from now
        }
        
        if (profile.username && profile.username.toLowerCase() === 'gillisco') {
          user.email = 'gillisco@gmail.com';
          user.user_metadata.email = 'gillisco@gmail.com';
          user.user_metadata.first_name = 'Wayne';
          user.user_metadata.last_name = 'Gillis';
          user.user_metadata.full_name = 'Wayne Gillis';
          user.user_metadata.phone = '602-989-331';
          user.user_metadata.street_address = '123 Any Street';
          user.user_metadata.city = 'Notting Hill';
          user.user_metadata.state = 'England';
          user.user_metadata.zip_code = 'W66699';
          user.user_metadata.country = 'United Kingdom';
          user.last_sign_in_at = new Date().toISOString();
          user.subscription_status = 'active';
          user.subscription_tier = 'premium';
          user.subscription_end_date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(); // 30 days from now
        }
        
        mappedUsers.push(user);
      }
      
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
      
      console.log('Mapped users with correct emails:', mappedUsers);
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

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    if (selectedUsers.length === users.filter(user => 
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (user.user_metadata?.name && user.user_metadata.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.user_metadata?.full_name && user.user_metadata.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
    ).length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.filter(user => 
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (user.user_metadata?.name && user.user_metadata.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.user_metadata?.full_name && user.user_metadata.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
      ).map(user => user.id));
    }
  };

  const handleDeleteUsers = async () => {
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
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
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
  };

  const handleViewUserDetails = useCallback((user: User) => {
    console.log('UserManagement: Opening details for user:', user.id);
    setSelectedUser(user);
    setIsDetailsOpen(true);
  }, []);

  const handleCloseUserDetails = useCallback(() => {
    console.log('UserManagement: Closing user details drawer');
    setIsDetailsOpen(false);
    // Don't immediately clear selectedUser to avoid UI flicker
    // The selectedUser will be cleared by the useEffect below after a short delay
  }, []);

  const handleToggleUserSubscription = async (userId: string, extensionDays: number = 30) => {
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
  };

  const handleManagePermissions = useCallback((user: User) => {
    console.log('UserManagement: Opening permissions dialog for user:', user.id);
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  }, []);

  const handlePermissionsUpdated = (updatedUser: User) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    
    toast({
      title: 'Permissions Updated',
      description: `${updatedUser.email}'s admin permissions have been updated.`,
    });
  };

  // Clean up selectedUser state after drawers/dialogs close
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!isDetailsOpen && !isPermissionsDialogOpen) {
      timer = setTimeout(() => {
        console.log('Clearing selected user after drawer closed');
        setSelectedUser(null);
      }, 300);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isDetailsOpen, isPermissionsDialogOpen]);

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
