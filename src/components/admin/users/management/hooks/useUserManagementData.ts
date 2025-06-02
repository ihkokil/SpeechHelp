
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
  
  // Update users when fetchedUsers changes
  useEffect(() => {
    if (fetchedUsers && fetchedUsers.length > 0) {
      setUsers(fetchedUsers);
      setIsLoading(false);
    }
    
    if (fetchError) {
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [fetchedUsers, fetchError, toast]);
  
  // Fetch users
  const fetchUsers = useCallback(async () => {
    console.log("Fetching users...");
    setIsLoading(true);
    try {
      await apiFetchUsers();
    } catch (error) {
      console.error("Error fetching users:", error);
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
    console.log("Force refreshing users...");
    setIsLoading(true);
    try {
      const refreshedUsers = await forceRefresh();
      if (refreshedUsers) {
        setUsers(refreshedUsers);
      }
    } catch (error) {
      console.error("Error refreshing users:", error);
      toast({
        title: "Error",
        description: "Failed to refresh users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
    isLoading: isLoading || isFetchLoading,
    fetchUsers,
    refreshUsers,
    addUser,
    updateUser,
    error: fetchError,
    lastFetchTime
  };
};
