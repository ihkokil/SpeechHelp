
import { useState, useCallback, useEffect } from 'react';
import { useFetchUsers } from './useFetchUsers';
import { User } from '../../types';
import { useToast } from '@/hooks/use-toast';

export const useUserManagementData = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch users data
  const { 
    users: fetchedUsers, 
    isLoading: isFetchLoading, 
    fetchUsers: apiFetchUsers,
    forceRefresh,
    error: fetchError,
    lastFetchTime
  } = useFetchUsers();
  
  // Update users and loading state when fetchedUsers changes
  useEffect(() => {
    console.log('useUserManagementData: fetchedUsers changed', {
      fetchedUsersLength: fetchedUsers?.length || 0,
      isFetchLoading,
      fetchError
    });
    
    // Always update the users state when fetchedUsers changes
    if (fetchedUsers) {
      console.log('useUserManagementData: Setting users from fetchedUsers');
      setUsers(fetchedUsers);
    }
    
    // Clear loading when fetch is complete (success or error)
    if (!isFetchLoading) {
      console.log('useUserManagementData: Clearing loading state');
      setIsLoading(false);
    }
    
    if (fetchError) {
      console.log('useUserManagementData: Fetch error occurred', fetchError);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive"
      });
    }
  }, [fetchedUsers, isFetchLoading, fetchError, toast]);
  
  // Fetch users
  const fetchUsers = useCallback(async () => {
    console.log("useUserManagementData: Fetching users...");
    setIsLoading(true);
    try {
      await apiFetchUsers();
      // Don't set loading to false here, let the useEffect handle it
    } catch (error) {
      console.error("useUserManagementData: Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [apiFetchUsers, toast]);

  // Force refresh function
  const refreshUsers = useCallback(async () => {
    console.log("useUserManagementData: Force refreshing users...");
    setIsLoading(true);
    try {
      const refreshedUsers = await forceRefresh();
      if (refreshedUsers) {
        setUsers(refreshedUsers);
      }
    } catch (error) {
      console.error("useUserManagementData: Error refreshing users:", error);
      toast({
        title: "Error",
        description: "Failed to refresh users. Please try again.",
        variant: "destructive"
      });
    }
    // Don't set loading to false here, let the useEffect handle it when isFetchLoading changes
  }, [forceRefresh, toast]);

  // Add new user to list
  const addUser = useCallback((newUser: User) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
  }, []);

  // Update user in list
  const updateUser = useCallback((updatedUser: User) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  }, []);

  return {
    users,
    setUsers,
    isLoading: isFetchLoading, // Use only the fetch loading state
    fetchUsers,
    refreshUsers,
    addUser,
    updateUser,
    error: fetchError,
    lastFetchTime
  };
};
