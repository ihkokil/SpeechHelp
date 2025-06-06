
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
    forceRefresh: apiForceRefresh,
    error: fetchError
  } = useFetchUsers();
  
  // Update users when fetchedUsers changes
  useEffect(() => {
    if (fetchedUsers && fetchedUsers.length >= 0) { // Allow empty arrays
      console.log('Updating users with fetched data:', fetchedUsers.length, 'users');
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
      const freshUsers = await apiFetchUsers();
      if (freshUsers) {
        setUsers(freshUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [apiFetchUsers, toast]);

  // Force refresh function
  const forceRefresh = useCallback(async () => {
    console.log("Force refreshing users...");
    setIsLoading(true);
    try {
      const freshUsers = await apiForceRefresh();
      if (freshUsers) {
        setUsers(freshUsers);
        toast({
          title: "Users Refreshed",
          description: "User data has been updated successfully.",
        });
      }
    } catch (error) {
      console.error("Error force refreshing users:", error);
      toast({
        title: "Error",
        description: "Failed to refresh users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [apiForceRefresh, toast]);

  // Add new user to list
  const addUser = useCallback((newUser: User) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
  }, []);

  return {
    users,
    setUsers,
    isLoading: isLoading || isFetchLoading,
    fetchUsers,
    forceRefresh,
    addUser,
    error: fetchError
  };
};
