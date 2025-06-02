
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
    error: fetchError
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
  
  // Fetch users with force refresh option
  const fetchUsers = useCallback(async (forceRefresh = false) => {
    console.log("Fetching users with force refresh:", forceRefresh);
    setIsLoading(true);
    try {
      await apiFetchUsers(forceRefresh);
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
  const forceRefresh = useCallback(async () => {
    console.log("Force refreshing user data...");
    await fetchUsers(true);
  }, [fetchUsers]);

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
